import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Languages, Volume2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da-DK', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi-FI', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no-NO', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'cs-CZ', name: 'Czech', flag: '🇨🇿' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ro-RO', name: 'Romanian', flag: '🇷🇴' },
  { code: 'el-GR', name: 'Greek', flag: '🇬🇷' }
];

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const fullTranscript = transcript + finalTranscript + interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }

        setVolume(Math.random() * 100);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript, isRecording]);

  const startRecording = () => {
    if (!recognitionRef.current || disabled) return;

    setTranscript('');
    recognitionRef.current.lang = selectedLanguage.code;
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsRecording(false);

    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript('');
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-orange-900 mb-1">
              Voice input not supported
            </div>
            <div className="text-sm text-orange-800">
              Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari for voice input.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-neutral-600" />
          <span className="text-sm font-semibold text-neutral-700">Voice Input</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            disabled={isRecording || disabled}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-neutral-200/50 rounded-xl hover:bg-white smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Languages className="w-4 h-4 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">
              {selectedLanguage.flag} {selectedLanguage.name}
            </span>
          </button>

          {showLanguageSelector && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 animate-fadeIn">
              <div className="p-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageSelector(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl smooth-transition ${
                      selectedLanguage.code === lang.code
                        ? 'bg-blue-50 text-blue-900'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full smooth-transition ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-rose-500 shadow-2xl shadow-red-500/50 scale-110'
              : disabled
              ? 'bg-neutral-200 cursor-not-allowed'
              : 'bg-gradient-to-br from-blue-600 to-cyan-600 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
            </>
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        <div className="flex-1">
          {isRecording ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-neutral-900">Recording...</span>
              </div>

              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 smooth-transition"
                  style={{ width: `${volume}%` }}
                ></div>
              </div>

              {transcript && (
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200/50">
                  <p className="text-sm text-blue-900 leading-relaxed">{transcript}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-neutral-600">
              Click the microphone to start speaking in {selectedLanguage.name}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border-l-4 border-cyan-500">
        <div className="text-xs font-bold text-cyan-900 mb-1 uppercase tracking-wide">
          How it works
        </div>
        <div className="text-sm text-cyan-800 leading-relaxed">
          Select your language, click the microphone, and speak naturally. The AI will transcribe your words in real-time. Click again to stop and add to your conflict description.
        </div>
      </div>
    </div>
  );
}
