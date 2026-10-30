import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, ExternalLink } from 'lucide-react';

export default function ShareQrCard({ title, description, value, fileName = 'qr-micatalogo' }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const generateQr = async () => {
      if (!value) {
        setQrDataUrl('');
        return;
      }

      const dataUrl = await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 8,
        color: {
          dark: '#111827',
          light: '#ffffff',
        },
      });

      if (!cancelled) setQrDataUrl(dataUrl);
    };

    generateQr();

    return () => {
      cancelled = true;
    };
  }, [value]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${fileName}.png`;
    link.click();
  };

  return (
    <div className="bg-white text-gray-950 border border-gray-200 rounded-lg p-5 space-y-4">
      <div>
        <h3 className="text-lg font-black">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-44 h-44 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={title} className="w-40 h-40" />
          ) : (
            <span className="text-sm text-gray-400">Generando QR...</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 break-all">
            {value}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 bg-gray-950 text-white px-3 py-2 rounded-lg text-sm font-bold">
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button type="button" onClick={downloadQr} className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-3 py-2 rounded-lg text-sm font-bold">
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-950 px-3 py-2 rounded-lg text-sm font-bold">
              <ExternalLink className="w-4 h-4" />
              Abrir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
