import io
import wave
import numpy as np
import os
from gradio_client import Client
from gtts import gTTS
from app.config import Config


# HuggingFace Spaces Endpoint
VALTEC_SPACE_ID = "valtecai-team/valtec-vietnamese-tts"


class TTSService:
    """Text-to-Speech service using Valtec TTS (primary) and Google TTS (fallback)."""

    def __init__(self):
        try:
            self.client = Client(VALTEC_SPACE_ID)
            print(f"Connected to Valtec TTS Space: {VALTEC_SPACE_ID}")
        except Exception as e:
            print(f"Could not connect to Valtec TTS Space: {e}")
            self.client = None

        self.default_speaker = Config.TTS_DEFAULT_SPEAKER

    def synthesize(
        self,
        text: str,
        speaker: str = None,
        speed: float = None,
    ) -> bytes:
        """
        Convert text to speech audio bytes.
        Prioritizes Valtec TTS, falls back to Google TTS.
        """
        # Try Valtec TTS first
        if self.client:
            try:
                return self._synthesize_valtec(text, speaker, speed)
            except Exception as e:
                print(f"[TTS] Valtec failed, falling back to Google TTS. Error: {e}")

        # Fallback to Google TTS
        return self._synthesize_google(text)

    def _synthesize_valtec(
        self,
        text: str,
        speaker: str = None,
        speed: float = None,
    ) -> bytes:
        speaker = speaker or self.default_speaker
        speed = speed or Config.TTS_DEFAULT_SPEED

        print(f"[TTS] Predicting with text: {text[:50]}...")
        print(f"[TTS] Speaker: {speaker}, Speed: {speed}")

        # Call predict API with all required arguments
        result = self.client.predict(
            text,           # _text_input
            speaker,        # _select_voice
            speed,          # tốc_độ
            0.667,          # noise_scale
            0.8,            # duration_noise
            0.2,            # sdp_ratio
            api_name="/synthesize"
        )

        if isinstance(result, tuple) or isinstance(result, list):
            result_path = result[0]
        else:
            result_path = result

        print(f"[TTS] Result path: {result_path}")

        with open(result_path, "rb") as f:
            audio_bytes = f.read()

        return audio_bytes

    def _synthesize_google(self, text: str, lang: str = "vi") -> bytes:
        """Fallback using Google TTS (mp3 -> wav conversion needed?)"""
        print("[TTS] Using Google TTS fallback")
        try:
            tts = gTTS(text=text, lang=lang)
            mp3_buffer = io.BytesIO()
            tts.write_to_fp(mp3_buffer)
            mp3_buffer.seek(0)

            # Since our frontend expects WAV (or whatever mimetype we set),
            # ideally we should return what matches the header.
            # voice.py currently returns audio/wav.
            # But gTTS outputs MP3.
            # Browsers can play MP3 if we change header or just send it.
            # Convert MP3 to WAV using pydub? Or just return MP3 bytes
            # and let the frontend/browser handle it (usually fine).
            return mp3_buffer.read()

        except Exception as e:
            print(f"[TTS] Google TTS error: {e}")
            return self._generate_silent_audio()

    def _generate_silent_audio(self, duration: float = 0.5) -> bytes:
        """Generate silent audio as fallback."""
        sample_rate = 22050
        samples = int(sample_rate * duration)
        audio = np.zeros(samples)
        return self._array_to_wav_bytes(audio, sample_rate)

    def _array_to_wav_bytes(
        self, audio: np.ndarray, sample_rate: int
    ) -> bytes:
        """Convert numpy audio array to WAV bytes."""
        audio_int16 = (audio * 32767).astype(np.int16)

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_int16.tobytes())

        buffer.seek(0)
        return buffer.read()

    def health_check(self) -> bool:
        return True


# Singleton instance
_tts_service = None


def get_tts_service() -> TTSService:
    global _tts_service
    if _tts_service is None:
        _tts_service = TTSService()
    return _tts_service
