import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

interface Reserva {
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: number;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  destinos = ['Paris', 'Nova York', 'Tóquio', 'Rio de Janeiro'];

  formReserva!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formReserva = this.fb.group({
      destino: ['', Validators.required],
      dataIda: ['', Validators.required],
      dataVolta: ['', Validators.required],
      passageiros: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      email: ['', [Validators.required, Validators.email]]
    }, { validators: this.validarDatas.bind(this) });
  }

  ngOnInit(): void {
    const dadosSalvos = localStorage.getItem('reserva');
    if (dadosSalvos) {
      this.formReserva.setValue(JSON.parse(dadosSalvos) as Reserva);
    }

    this.formReserva.valueChanges.subscribe((value: Reserva) => {
      localStorage.setItem('reserva', JSON.stringify(value));
    });
  }

  validarDatas(group: AbstractControl): ValidationErrors | null {
    const ida = group.get('dataIda')?.value;
    const volta = group.get('dataVolta')?.value;

    if (ida && volta && volta <= ida) {
      return { dataInvalida: true };
    }
    return null;
  }

  enviar() {
    console.log('Dados enviados:', this.formReserva.value);
    alert('Reserva realizada com sucesso!');
    localStorage.removeItem('reserva');
    this.formReserva.reset();
  }
}