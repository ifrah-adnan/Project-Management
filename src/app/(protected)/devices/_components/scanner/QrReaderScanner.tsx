import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";

interface QRCodeScannerProps {
  onScan: (result: string | null) => void;
  onError: (error: Error) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
  const [hasError, setHasError] = useState(false); // State to track if an error has been shown

  useEffect(() => {
    const newScanner = new BrowserMultiFormatReader();
    setScanner(newScanner);

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, ["QR_CODE"]);

    newScanner.decodeFromVideoDevice(
      null,
      videoRef.current!,
      (result, error) => {
        if (result) {
          onScan(result.getText());
          setHasError(false); // Reset error state on successful scan
        } else if (error && !hasError) {
          onError(error);
          setHasError(true); // Set error state to prevent further error notifications
        }
      },
    );

    return () => {
      newScanner.reset(); // Cleanup scanner when component unmounts
      setHasError(false); // Reset error state when the component is unmounted
    };
  }, [onScan, onError, hasError]);

  return <video ref={videoRef} style={{ width: "100%" }} />;
};

export default QRCodeScanner;
