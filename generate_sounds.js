const fs = require('fs');
const path = require('path');

function writeWav(filename, frequency, durationSec) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const chunkSize = 36 + dataSize;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat
  buffer.writeUInt16LE(1, 22); // NumChannels
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(byteRate, 28); // ByteRate
  buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  
  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Write audio data (Square wave for more digital/retro feel)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const period = 1.0 / frequency;
    // Add some noise for rip/dialup
    let val = Math.sin(2 * Math.PI * frequency * t);
    if (filename.includes('rip') || filename.includes('dialup')) {
      val += (Math.random() * 2 - 1) * 0.5; // noise
    }
    const sample = Math.max(-32768, Math.min(32767, val * 20000));
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  
  fs.writeFileSync(path.join(__dirname, 'public', 'sounds', filename), buffer);
}

fs.mkdirSync(path.join(__dirname, 'public', 'sounds'), { recursive: true });
writeWav('error.wav', 150, 0.5); 
writeWav('rip.wav', 800, 0.3); 
writeWav('dialup.wav', 1200, 1.0); 
writeWav('click.wav', 2500, 0.05); 
writeWav('ambience.wav', 60, 2.0);

console.log('Dummy sounds generated in public/sounds.');
