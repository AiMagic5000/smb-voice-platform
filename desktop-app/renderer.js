// SMB Voice Desktop Softphone - Renderer Process
// Uses SIP.js for WebRTC-based VoIP

class SMBVoiceSoftphone {
  constructor() {
    this.userAgent = null;
    this.registerer = null;
    this.currentSession = null;
    this.callTimer = null;
    this.callDuration = 0;
    this.isMuted = false;
    this.isOnHold = false;
    this.callHistory = [];

    this.elements = {
      // Screens
      loginScreen: document.getElementById('loginScreen'),
      phoneScreen: document.getElementById('phoneScreen'),
      callScreen: document.getElementById('callScreen'),
      incomingCallModal: document.getElementById('incomingCallModal'),

      // Login form
      loginForm: document.getElementById('loginForm'),
      sipServer: document.getElementById('sipServer'),
      sipUser: document.getElementById('sipUser'),
      sipPassword: document.getElementById('sipPassword'),
      displayName: document.getElementById('displayName'),

      // Status
      statusIndicator: document.getElementById('statusIndicator'),

      // Dialpad
      phoneNumber: document.getElementById('phoneNumber'),
      backspaceBtn: document.getElementById('backspaceBtn'),
      callBtn: document.getElementById('callBtn'),

      // Tabs
      tabs: document.querySelectorAll('.tab'),
      tabContents: document.querySelectorAll('.tab-content'),

      // Call screen
      callerName: document.getElementById('callerName'),
      callerNumber: document.getElementById('callerNumber'),
      callStatus: document.getElementById('callStatus'),
      callTimerDisplay: document.getElementById('callTimer'),
      muteBtn: document.getElementById('muteBtn'),
      holdBtn: document.getElementById('holdBtn'),
      speakerBtn: document.getElementById('speakerBtn'),
      endCallBtn: document.getElementById('endCallBtn'),

      // Incoming call
      incomingCallerName: document.getElementById('incomingCallerName'),
      incomingCallerNumber: document.getElementById('incomingCallerNumber'),
      answerCallBtn: document.getElementById('answerCallBtn'),
      declineCallBtn: document.getElementById('declineCallBtn'),

      // Settings
      settingsExtension: document.getElementById('settingsExtension'),
      settingsServer: document.getElementById('settingsServer'),
      settingsStatus: document.getElementById('settingsStatus'),
      logoutBtn: document.getElementById('logoutBtn'),
      microphoneSelect: document.getElementById('microphoneSelect'),
      speakerSelect: document.getElementById('speakerSelect'),

      // History
      historyList: document.getElementById('historyList'),

      // Audio
      ringtone: document.getElementById('ringtone'),
      remoteAudio: document.getElementById('remoteAudio')
    };

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadSavedCredentials();
    await this.loadCallHistory();
    await this.populateAudioDevices();
  }

  bindEvents() {
    // Login form
    this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

    // Dialpad buttons
    document.querySelectorAll('.dialpad-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleDialpadPress(btn.dataset.digit));
    });

    // Backspace
    this.elements.backspaceBtn.addEventListener('click', () => this.handleBackspace());

    // Call button
    this.elements.callBtn.addEventListener('click', () => this.makeCall());

    // Tabs
    this.elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Call controls
    this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
    this.elements.holdBtn.addEventListener('click', () => this.toggleHold());
    this.elements.endCallBtn.addEventListener('click', () => this.endCall());

    // Incoming call
    this.elements.answerCallBtn.addEventListener('click', () => this.answerCall());
    this.elements.declineCallBtn.addEventListener('click', () => this.declineCall());

    // Logout
    this.elements.logoutBtn.addEventListener('click', () => this.disconnect());

    // Keyboard input
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Navigation from main process
    if (window.electronAPI) {
      window.electronAPI.onNavigate((page) => {
        if (page === 'settings') {
          this.switchTab('settings');
        }
      });
    }
  }

  async loadSavedCredentials() {
    if (!window.electronAPI) return;

    const credentials = await window.electronAPI.getStore('credentials');
    if (credentials) {
      this.elements.sipServer.value = credentials.server || '';
      this.elements.sipUser.value = credentials.user || '';
      this.elements.sipPassword.value = credentials.password || '';
      this.elements.displayName.value = credentials.displayName || '';
    }
  }

  async saveCredentials(credentials) {
    if (!window.electronAPI) return;
    await window.electronAPI.setStore('credentials', credentials);
  }

  async loadCallHistory() {
    if (!window.electronAPI) return;

    const history = await window.electronAPI.getStore('callHistory');
    if (history) {
      this.callHistory = history;
      this.renderCallHistory();
    }
  }

  async saveCallHistory() {
    if (!window.electronAPI) return;

    // Keep only last 50 calls
    const historyToSave = this.callHistory.slice(0, 50);
    await window.electronAPI.setStore('callHistory', historyToSave);
  }

  async populateAudioDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const microphones = devices.filter(d => d.kind === 'audioinput');
      const speakers = devices.filter(d => d.kind === 'audiooutput');

      this.elements.microphoneSelect.innerHTML = microphones.map(d =>
        `<option value="${d.deviceId}">${d.label || 'Microphone ' + d.deviceId.slice(0, 8)}</option>`
      ).join('');

      this.elements.speakerSelect.innerHTML = speakers.map(d =>
        `<option value="${d.deviceId}">${d.label || 'Speaker ' + d.deviceId.slice(0, 8)}</option>`
      ).join('');
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const server = this.elements.sipServer.value.trim();
    const user = this.elements.sipUser.value.trim();
    const password = this.elements.sipPassword.value;
    const displayName = this.elements.displayName.value.trim() || user;

    if (!server || !user || !password) {
      alert('Please fill in all required fields');
      return;
    }

    // Save credentials
    await this.saveCredentials({ server, user, password, displayName });

    // Update UI
    this.setStatus('connecting', 'Connecting...');

    // Connect to SIP server
    await this.connect(server, user, password, displayName);
  }

  async connect(server, user, password, displayName) {
    try {
      // Dynamic import SIP.js
      const { UserAgent, Registerer, Inviter, SessionState } = await import('sip.js');

      const uri = UserAgent.makeURI(`sip:${user}@${server}`);
      if (!uri) {
        throw new Error('Invalid SIP URI');
      }

      const transportOptions = {
        server: `wss://${server}:443`
      };

      const userAgentOptions = {
        authorizationPassword: password,
        authorizationUsername: user,
        displayName: displayName,
        transportOptions: transportOptions,
        uri: uri,
        delegate: {
          onInvite: (invitation) => this.handleIncomingCall(invitation)
        }
      };

      this.userAgent = new UserAgent(userAgentOptions);

      // Start the user agent
      await this.userAgent.start();

      // Create registerer and register
      this.registerer = new Registerer(this.userAgent);

      this.registerer.stateChange.addListener((state) => {
        console.log('Registration state:', state);
        switch (state) {
          case 'Registered':
            this.setStatus('online', 'Online');
            this.showPhoneScreen();
            this.updateSettings(user, server);
            break;
          case 'Unregistered':
            this.setStatus('offline', 'Offline');
            break;
          case 'Terminated':
            this.setStatus('offline', 'Disconnected');
            break;
        }
      });

      await this.registerer.register();

    } catch (err) {
      console.error('Connection error:', err);
      this.setStatus('offline', 'Error');
      alert('Failed to connect: ' + err.message);
    }
  }

  async disconnect() {
    if (this.registerer) {
      try {
        await this.registerer.unregister();
      } catch (err) {
        console.error('Unregister error:', err);
      }
    }

    if (this.userAgent) {
      try {
        await this.userAgent.stop();
      } catch (err) {
        console.error('Stop error:', err);
      }
    }

    this.userAgent = null;
    this.registerer = null;
    this.setStatus('offline', 'Offline');
    this.showLoginScreen();
  }

  async makeCall() {
    const target = this.elements.phoneNumber.value.trim();
    if (!target) return;

    if (!this.userAgent) {
      alert('Not connected. Please sign in first.');
      return;
    }

    try {
      const { Inviter } = await import('sip.js');

      const targetUri = UserAgent.makeURI(`sip:${target}@${this.elements.sipServer.value}`);
      if (!targetUri) {
        throw new Error('Invalid target');
      }

      const inviter = new Inviter(this.userAgent, targetUri);
      this.currentSession = inviter;

      this.setupSessionHandlers(inviter);

      await inviter.invite({
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false }
        }
      });

      this.showCallScreen(target, target, 'outgoing');
      this.addToHistory('outgoing', target);

    } catch (err) {
      console.error('Call error:', err);
      alert('Failed to make call: ' + err.message);
    }
  }

  handleIncomingCall(invitation) {
    this.currentSession = invitation;

    const callerNumber = invitation.remoteIdentity?.uri?.user || 'Unknown';
    const callerName = invitation.remoteIdentity?.displayName || callerNumber;

    this.elements.incomingCallerName.textContent = callerName;
    this.elements.incomingCallerNumber.textContent = this.formatPhoneNumber(callerNumber);

    this.elements.incomingCallModal.classList.add('active');
    this.elements.ringtone.play().catch(() => {});

    this.setupSessionHandlers(invitation);

    // Show notification
    if (window.electronAPI) {
      window.electronAPI.showNotification('Incoming Call', `${callerName} is calling`);
    }
  }

  async answerCall() {
    if (!this.currentSession) return;

    this.elements.ringtone.pause();
    this.elements.ringtone.currentTime = 0;
    this.elements.incomingCallModal.classList.remove('active');

    try {
      await this.currentSession.accept({
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false }
        }
      });

      const callerNumber = this.currentSession.remoteIdentity?.uri?.user || 'Unknown';
      const callerName = this.currentSession.remoteIdentity?.displayName || callerNumber;

      this.showCallScreen(callerNumber, callerName, 'incoming');
      this.addToHistory('incoming', callerNumber);

    } catch (err) {
      console.error('Answer error:', err);
      this.hideCallScreen();
    }
  }

  declineCall() {
    if (!this.currentSession) return;

    this.elements.ringtone.pause();
    this.elements.ringtone.currentTime = 0;
    this.elements.incomingCallModal.classList.remove('active');

    try {
      this.currentSession.reject();
    } catch (err) {
      console.error('Decline error:', err);
    }

    const callerNumber = this.currentSession.remoteIdentity?.uri?.user || 'Unknown';
    this.addToHistory('missed', callerNumber);

    this.currentSession = null;
  }

  setupSessionHandlers(session) {
    const { SessionState } = require('sip.js');

    session.stateChange.addListener((state) => {
      console.log('Session state:', state);

      switch (state) {
        case SessionState.Establishing:
          this.elements.callStatus.textContent = 'Connecting...';
          break;
        case SessionState.Established:
          this.elements.callStatus.textContent = 'Connected';
          this.startCallTimer();
          this.setupAudio(session);
          break;
        case SessionState.Terminating:
          this.elements.callStatus.textContent = 'Ending...';
          break;
        case SessionState.Terminated:
          this.endCallCleanup();
          break;
      }
    });
  }

  setupAudio(session) {
    const remoteStream = new MediaStream();

    session.sessionDescriptionHandler?.peerConnection?.getReceivers().forEach((receiver) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track);
      }
    });

    this.elements.remoteAudio.srcObject = remoteStream;
    this.elements.remoteAudio.play().catch(err => console.error('Audio play error:', err));
  }

  endCall() {
    if (!this.currentSession) return;

    try {
      if (this.currentSession.state === 'Established') {
        this.currentSession.bye();
      } else {
        this.currentSession.cancel();
      }
    } catch (err) {
      console.error('End call error:', err);
    }
  }

  endCallCleanup() {
    this.stopCallTimer();
    this.currentSession = null;
    this.isMuted = false;
    this.isOnHold = false;
    this.hideCallScreen();

    // Update button states
    this.elements.muteBtn.classList.remove('active');
    this.elements.holdBtn.classList.remove('active');
  }

  toggleMute() {
    if (!this.currentSession) return;

    this.isMuted = !this.isMuted;

    const pc = this.currentSession.sessionDescriptionHandler?.peerConnection;
    if (pc) {
      pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = !this.isMuted;
        }
      });
    }

    this.elements.muteBtn.classList.toggle('active', this.isMuted);
  }

  async toggleHold() {
    if (!this.currentSession) return;

    try {
      if (this.isOnHold) {
        await this.currentSession.unhold();
      } else {
        await this.currentSession.hold();
      }
      this.isOnHold = !this.isOnHold;
      this.elements.holdBtn.classList.toggle('active', this.isOnHold);
    } catch (err) {
      console.error('Hold error:', err);
    }
  }

  startCallTimer() {
    this.callDuration = 0;
    this.updateTimerDisplay();

    this.callTimer = setInterval(() => {
      this.callDuration++;
      this.updateTimerDisplay();
    }, 1000);
  }

  stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.callDuration / 60);
    const seconds = this.callDuration % 60;
    this.elements.callTimerDisplay.textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  handleDialpadPress(digit) {
    const current = this.elements.phoneNumber.value;
    if (current.length < 20) {
      this.elements.phoneNumber.value = current + digit;
    }

    // Send DTMF if in call
    if (this.currentSession && this.currentSession.state === 'Established') {
      this.currentSession.sessionDescriptionHandler?.sendDtmf(digit);
    }
  }

  handleBackspace() {
    const current = this.elements.phoneNumber.value;
    this.elements.phoneNumber.value = current.slice(0, -1);
  }

  handleKeyboard(e) {
    // Only handle if phone screen is visible
    if (!this.elements.phoneScreen.classList.contains('active')) return;

    const dialpadKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];

    if (dialpadKeys.includes(e.key)) {
      this.handleDialpadPress(e.key);
    } else if (e.key === 'Backspace') {
      this.handleBackspace();
    } else if (e.key === 'Enter') {
      this.makeCall();
    }
  }

  switchTab(tabName) {
    this.elements.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    this.elements.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}Tab`);
    });
  }

  setStatus(status, text) {
    const dot = this.elements.statusIndicator.querySelector('.status-dot');
    const textEl = this.elements.statusIndicator.querySelector('.status-text');

    dot.className = `status-dot ${status}`;
    textEl.textContent = text;

    // Update tray
    if (window.electronAPI) {
      window.electronAPI.updateTrayStatus(text);
    }
  }

  showLoginScreen() {
    this.elements.loginScreen.classList.add('active');
    this.elements.phoneScreen.classList.remove('active');
    this.elements.callScreen.classList.remove('active');
  }

  showPhoneScreen() {
    this.elements.loginScreen.classList.remove('active');
    this.elements.phoneScreen.classList.add('active');
    this.elements.callScreen.classList.remove('active');
  }

  showCallScreen(number, name, type) {
    this.elements.callerNumber.textContent = this.formatPhoneNumber(number);
    this.elements.callerName.textContent = name || number;
    this.elements.callStatus.textContent = type === 'outgoing' ? 'Calling...' : 'Incoming call';
    this.elements.callTimerDisplay.textContent = '00:00';

    this.elements.loginScreen.classList.remove('active');
    this.elements.phoneScreen.classList.remove('active');
    this.elements.callScreen.classList.add('active');
  }

  hideCallScreen() {
    this.elements.callScreen.classList.remove('active');
    this.elements.phoneScreen.classList.add('active');
    this.elements.phoneNumber.value = '';
  }

  updateSettings(extension, server) {
    this.elements.settingsExtension.textContent = extension;
    this.elements.settingsServer.textContent = server;
    this.elements.settingsStatus.textContent = 'Online';
  }

  addToHistory(type, number) {
    const entry = {
      type,
      number,
      timestamp: new Date().toISOString(),
      duration: type !== 'missed' ? this.callDuration : 0
    };

    this.callHistory.unshift(entry);
    this.saveCallHistory();
    this.renderCallHistory();
  }

  renderCallHistory() {
    if (this.callHistory.length === 0) {
      this.elements.historyList.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
          <p>No recent calls</p>
        </div>
      `;
      return;
    }

    const iconMap = {
      incoming: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"/></svg>`,
      outgoing: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/></svg>`,
      missed: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"/></svg>`
    };

    this.elements.historyList.innerHTML = this.callHistory.map(call => {
      const date = new Date(call.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString();
      const duration = call.duration > 0 ? this.formatDuration(call.duration) : '';

      return `
        <div class="history-item" onclick="app.elements.phoneNumber.value='${call.number}'">
          <div class="history-icon ${call.type}">
            ${iconMap[call.type]}
          </div>
          <div class="history-info">
            <div class="history-number">${this.formatPhoneNumber(call.number)}</div>
            <div class="history-time">${timeStr} - ${dateStr}</div>
          </div>
          <div class="history-duration">${duration}</div>
        </div>
      `;
    }).join('');
  }

  formatPhoneNumber(number) {
    // Simple US format
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
    }
    return number;
  }

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }
}

// Initialize app
const app = new SMBVoiceSoftphone();
