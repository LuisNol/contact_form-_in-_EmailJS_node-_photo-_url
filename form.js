emailjs.init('T3fcLKKohH7OTZnop'); // Tu User ID de EmailJS

const btn = document.getElementById('button');
const form = document.getElementById('form');

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  btn.value = 'Enviando...';

  const fileInput = document.getElementById('photo_references');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const upload = await fetch('http://foto.producto.jook.lat/upload-image', {
      method: 'POST',
      body: formData
    });
     //const upload = await fetch('http://foto.producto.jook.lat/upload-image', {
    const result = await upload.json();

    if (upload.ok) {
      // Establecer la URL de la imagen como valor del campo oculto photo_reference
      document.getElementById('photo_reference').value = result.photo_reference;

      // Enviar el formulario a EmailJS
      emailjs.sendForm('default_service', 'template_di4p7c8', form)
        .then(() => {
          btn.value = 'Enviar solicitud';
          alert('¡Formulario enviado correctamente con la imagen!');
          form.reset();
        })
        .catch((err) => {
          console.error(err);
          btn.value = 'Enviar solicitud';
          alert('Error al enviar el formulario: ' + JSON.stringify(err));
        });
    } else {
      alert('Error al subir la imagen');
      btn.value = 'Enviar solicitud';
    }
  } catch (err) {
    console.error(err);
    alert('Error de red o servidor.');
    btn.value = 'Enviar solicitud';
  }
});
