<?php include 'inc/layout/header.php';
      include 'inc/funciones/funciones.php';

$id = filter_var($_GET['id'], FILTER_VALIDATE_INT); //Validar que el id sea un entero

if(!$id) {
  die('No es valido');
}

$resultado = obtenerContacto($id);

$contacto = $resultado->fetch_assoc(); //Obtenemos los datos

?>

<div class="contenedor-barra">
  <div class="contenedor barra">
    <a href="index.php" class="btn volver">Volver</a>
    <h1>Editar Contacto</h1>
  </div>
</div>

<div class="bg-amarrillo contenedor sombra clearfix">
  <form id="contacto" action="#">
    <legend>Edite el contacto<span></span></legend>
    <?php include 'inc/layout/formulario.php'; ?>
  </form>
</div>

<?php include 'inc/layout/footer.php'; ?>
