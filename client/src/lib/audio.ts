// Audio synthesis and playback utilities for sound-color synesthesia test

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser:', error);
    }
  }

  private async ensureAudioContextRunning() {
    if (!this.audioContext) return false;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return true;
  }

  async playTone(frequency: number, duration: number = 2000): Promise<void> {
    if (!(await this.ensureAudioContextRunning())) return;

    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
    oscillator.type = 'sine';

    // Envelope for smooth start/stop
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + duration / 1000 - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration / 1000);

    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + duration / 1000);
  }

  async playChord(frequencies: number[], duration: number = 2000): Promise<void> {
    if (!(await this.ensureAudioContextRunning())) return;

    const oscillators = frequencies.map(frequency => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + duration / 1000 - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration / 1000);

      return oscillator;
    });

    oscillators.forEach(oscillator => {
      oscillator.start(this.audioContext!.currentTime);
      oscillator.stop(this.audioContext!.currentTime + duration / 1000);
    });
  }

  async playNoisePattern(type: 'white' | 'pink' = 'white', duration: number = 2000): Promise<void> {
    if (!(await this.ensureAudioContextRunning())) return;

    const bufferSize = this.audioContext!.sampleRate * (duration / 1000);
    const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext!.createBufferSource();
    const gainNode = this.audioContext!.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext!.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext!.currentTime + duration / 1000 - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration / 1000);

    source.start(this.audioContext!.currentTime);
  }

  // Predefined sound patterns for the test
  getSoundGenerator(soundId: string): () => Promise<void> {
    const generators: Record<string, () => Promise<void>> = {
      'piano-c4': () => this.playTone(261.63, 2000), // C4
      'violin-a': () => this.playTone(440, 2500), // A4
      'thunder': () => this.playNoisePattern('white', 3000),
      'rain': () => this.playNoisePattern('pink', 4000),
      'bell': () => this.playTone(523.25, 3000), // C5
      'guitar-chord': () => this.playChord([196, 246.94, 293.66], 2500), // G major
      'flute': () => this.playTone(783.99, 2000), // G5
      'drum-beat': () => this.playNoisePattern('white', 500),
      'ocean-waves': () => this.playNoisePattern('pink', 5000),
      'bird-song': () => this.playTone(1760, 1500), // A6
      'car-horn': () => this.playTone(110, 1000), // A2
      'wind': () => this.playNoisePattern('pink', 4000),
    };

    return generators[soundId] || (() => Promise.resolve());
  }
}

export const audioManager = new AudioManager();
