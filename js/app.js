const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
	formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
	e.preventDefault();
	// !validar
	const ciudad = document.querySelector("#ciudad").value;
	const pais = document.querySelector("#pais").value;
	if (pais === "" || ciudad === "") {
		mostrarError("Ambos campos son obligatorios");
		return;
	}

	// !Consultar Api
	consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
	const alerta = document.querySelector(".newAlerta");

	if (!alerta) {
		const newAlerta = document.createElement("div");
		newAlerta.classList.add(
			"bg-red-100",
			"border-red-400",
			"text-red-700",
			"px-4",
			"py-3",
			"rounded",
			"max-w-md",
			"mx-auto",
			"mt-6",
			"text-center",
			"newAlerta"
		);
		newAlerta.innerHTML = `
        <strong class="font-bold">Error</strong>
        <span class="block">${mensaje}</span>
        `;
		container.appendChild(newAlerta);

		setTimeout(() => {
			newAlerta.remove();
		}, 4000);
	}
}

function consultarAPI(ciudad, pais) {
	const appID = "abbe448241988abc957e3654e3deac44";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((datos) => {
			// !En caso de que no exista la ciudad
			if (datos.cod === "404") {
				mostrarError(
					`La ciudad: "${ciudad}", parece no existir, por favor verifique`
				);
			}

			// !Mostramos datos
			mostarClima(datos);
		});
}

function actual() {
	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords;
		// Show a map centered at latitude / longitude.
		setTimeout(() => {
			const appID = "abbe448241988abc957e3654e3deac44";
			const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appID}`;

			fetch(url)
				.then((respuesta) => respuesta.json())
				.then((datos) => {
					// !En caso de que no exista la ciudad
					if (datos.cod === "404") {
						mostrarError(
							`La ciudad: "${ciudad}", parece no existir, por favor verifique`
						);
					}

					// !Mostramos datos
					const {
						name,
						main: {
							temp,
							temp_max,
							temp_min,
						},
					} = datos;
					const centigrados = (
						temp - 273.15
					).toFixed(1);
					const titulo =
						document.querySelector(
							"#titulo"
						);
					const tempActual =
						document.createElement("p");
					titulo.innerText = `En ${name} la temperatura es ${centigrados}°C`;
				});
		}, 200);
	});
}

function mostarClima(datos) {
	console.log(datos);
	const {
		name,
		main: { temp, temp_max, temp_min },
	} = datos;
	const centigrados = (temp - 273.15).toFixed(1);

	const actual = document.createElement("p");
	actual.innerHTML = `Actualmente en ${name} la temperatura es ${centigrados} &#8451;`;
	actual.classList.add("font-bold", "text-6xl");

	const resultadoDiv = document.createElement("div");
	resultadoDiv.classList.add("text-center", "text-white");
	resultadoDiv.appendChild(actual);

	resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

actual();
