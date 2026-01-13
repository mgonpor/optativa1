package com.daw.persistence.entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tarea")
@Getter
@Setter
@NoArgsConstructor
public class Tarea {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String titulo;
	private String descripcion;

	@Column(name = "fecha_creacion")
	private LocalDate fechaCreacion;

	@Column(name = "fecha_vencimiento")
	private LocalDate fechaVencimiento;
	
	@Enumerated(value = EnumType.STRING)
	private Estado estado;

	@Column(name = "id_usuario")
	private int idUsuario;

	@ManyToOne
	@JoinColumn(name = "id_usuario", referencedColumnName = "id", insertable = false, updatable = false)
	@JsonIgnore
	private Usuario usuario;
	
}
