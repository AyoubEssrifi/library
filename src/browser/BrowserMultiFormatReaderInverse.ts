import { BrowserCodeReader } from './BrowserCodeReader';
import MultiFormatReader from '../core/MultiFormatReader';
import BinaryBitmap from '../core/BinaryBitmap';
import DecodeHintType from '../core/DecodeHintType';
import { HTMLCanvasElementLuminanceSource } from './HTMLCanvasElementLuminanceSource';
import { HTMLVisualMediaElement } from './HTMLVisualMediaElement';
import HybridBinarizer from '../core/common/HybridBinarizer';

export class BrowserMultiFormatReaderInverse extends BrowserCodeReader {

  protected readonly reader: MultiFormatReader;

  public constructor(
    hints: Map<DecodeHintType, any> = null,
    timeBetweenScansMillis: number = 500
  ) {
    const reader = new MultiFormatReader();
    reader.setHints(hints);
    super(reader, timeBetweenScansMillis);
  }

  /**
   * Overwrite createBinaryBitmap to inverse the image before scanning
   * Used for data matrix with black background
   */
  public createBinaryBitmap(mediaElement: HTMLVisualMediaElement): BinaryBitmap {

    const ctx = this.getCaptureCanvasContext(mediaElement);

    this.drawImageOnCanvas(ctx, mediaElement);

    const canvas = this.getCaptureCanvas(mediaElement);

    const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
    const invertedLuminance = luminanceSource.invert()
    const hybridBinarizer = new HybridBinarizer(invertedLuminance);

    return new BinaryBitmap(hybridBinarizer);
  }
}
