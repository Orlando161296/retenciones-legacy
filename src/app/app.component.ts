import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PrintServiceService } from './service/print-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private pdfService = inject(PrintServiceService);

  public baseImponible: number = 0;
  public calculate: boolean = false;
  public iva: number = 0;
  public totalInvoice: number = 0;
  public ivaRetener: number = 0;
  public totalPayd: number = 0;

  facturaForm = new FormGroup({
    nombre: new FormControl(''),
    responsable: new FormControl(''),
    comprobante: new FormControl(''),
    periodoF: new FormControl(''),
    fechaEmision: new FormControl(''),
    rif: new FormControl(''),
    direccionFiscal: new FormControl(''),
    numeroComprobante: new FormControl(''),
    porcentajeRetener: new FormControl(''),
    numeroOperacion: new FormControl(''),
    fechaFactura: new FormControl(''),
    numeroFactura: new FormControl(''),
    numeroControl: new FormControl(''),
    baseImponible: new FormControl(''),
    impuestoRetener: new FormControl(''),
  });

  ngOnInit(): void {
    this.facturaForm.get('impuestoRetener')?.valueChanges.subscribe((value) => {
      if (value === '1%' || value === '2%') {
        this.facturaForm.get('porcentajeRetener')?.disable();
      } else {
        this.facturaForm.get('porcentajeRetener')?.enable();
      }
    });
  }

  public options = [
    {
      value: '1',
      viewValue: '100%',
    },
    {
      value: '0.75',
      viewValue: '75%',
    },
  ];

  public periodoFiscal = [
    {
      value: '2024-01',
    },
    {
      value: '2024-02',
    },
    {
      value: '2024-03',
    },
    {
      value: '2024-04',
    },
    {
      value: '2024-05',
    },
    {
      value: '2024-06',
    },
    {
      value: '2024-07',
    },
    {
      value: '2024-08',
    },
    {
      value: '2024-09',
    },
    {
      value: '2024-10',
    },
    {
      value: '2024-11',
    },
    {
      value: '2024-12',
    },
  ];

  public alicuotas = [
    {
      value: '0.16',
      viewValue: '16%',
    },
    {
      value: '0.02',
      viewValue: '2%',
    },
    {
      value: '0.01',
      viewValue: '1%',
    },
  ];

  printPdf() {
    let data = this.facturaForm.value; // Obtienes los datos del formulario
    data.fechaFactura = new Date(data.fechaFactura!).toLocaleDateString(
      'es-ES'
    );
    data.fechaEmision = new Date(data.fechaEmision!).toLocaleDateString(
      'es-ES'
    );
    this.pdfService.createPdf(
      data,
      this.baseImponible,
      this.iva,
      this.ivaRetener,
      this.totalPayd,
      this.totalInvoice
    ); // Pasas los datos al método createPdf
  }

  /**
   * Este método me inicia el calculo de la retención
   */
  calculateRetention() {
    this.baseImponible = Number(this.facturaForm.get('baseImponible')!.value);
    this.calculate = true;
    this.iva = this.calculateTaxRetain(this.baseImponible);
    this.totalInvoice = this.calculateTotalInvoice(
      this.baseImponible,
      this.iva
    );
    this.ivaRetener = this.calculateIvaRetenido(this.iva);
    this.totalPayd = this.calculateTotalPayd(
      this.ivaRetener,
      this.totalInvoice
    );
  }

  /**
   *Este método calcula el impuesto generado
   * @param baseImponible recibe como parametro la base imponible
   * @returns { totalIva } retorna el iva calculado
   */
  calculateTaxRetain(baseImponible: number): number {
    const ivaValue = Number(this.facturaForm.get('impuestoRetener')!.value);
    console.log(ivaValue);

    let totalIva = baseImponible * ivaValue;
    console.log(totalIva);

    return totalIva;
  }

  /**
   *
   * @param base recibe la base imponible
   * @param iva recibe el total Iva
   * @returns retorna el total de la factura
   */
  calculateTotalInvoice(base: number, iva: number): number {
    return (this.totalInvoice = base + iva);
  }

  /**
   *
   * @param Recibe el Iva
   * @returns { ivaRetener }retorna el iva retenido
   */
  calculateIvaRetenido(iva: number): number {
    const porcentajeRetener = Number(
      this.facturaForm.get('porcentajeRetener')!.value
    );
    if (porcentajeRetener === 0) {
      return iva;
    }
    const ivaRetener = iva * porcentajeRetener;
    console.log('IVA A RETENER', ivaRetener);

    return ivaRetener;
  }

  /**
   *
   * @param ivaRetenido recibe el iva retenido
   * @param totalInvoice recibe el total de la factura
   * @returns { totalPayd } retorna el total a pagar
   */
  calculateTotalPayd(ivaRetenido: number, totalInvoice: number): number {
    const ivaValue = Number(this.facturaForm.get('impuestoRetener')!.value);

    const totalPayd = totalInvoice - ivaRetenido;

    if (ivaValue === 0.01 || ivaValue === 0.02) {
      return this.baseImponible - ivaRetenido;
    }
    return totalPayd;
  }
}
