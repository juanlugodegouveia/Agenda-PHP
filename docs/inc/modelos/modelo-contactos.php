<?php


if(isset($_POST["accion"]))
{ //Lo agregue de las preguntas seccion 50,clase 417
if($_POST['accion'] == 'crear') {
  //Creara un nuevo registro en la base de trader_cdlrisefall3methods

  require_once('../funciones/bd.php');


  //Validar las entradas

  $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
  $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
  $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

  try {
    $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)"); //$conn debe ser la misma que se declaro en la base de datos, los signos de interrogación son la cantidad de elementos que se pasaran
    $stmt->bind_param("sss", $nombre, $empresa, $telefono); //S = string, sintaxis que se utilzia, la cantidad de s es la cantidad de parametros.
    $stmt->execute();
    if($stmt->affected_rows == 1) {
      $respuesta = array (
        'respuesta' => 'correcto',
        'datos' => array(
          'nombre' => $nombre,
          'empresa' => $empresa,
          'telefono' => $telefono,
          'id_insertado' => $stmt->insert_id
        )
      );
    }
    $stmt->close();
    $conn->close();
  } catch (Exception $e) {
    $respuesta = array (
      'error' => $e->getMessage()
    );
  }

  echo json_encode($respuesta);
}
}

if(isset($_GET["accion"]))
{ //Lo agregue de las preguntas seccion 50,clase 417
if($_GET['accion'] == 'borrar') {
  require_once('../funciones/bd.php');

  $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

  try {
    $stmt = $conn->prepare("DELETE FROM contactos WHERE id= ? "); //El sigo de interrogacion es el placeholder que declaramos
    $stmt->bind_param("i", $id);
    $stmt->execute();
    if($stmt->affected_rows == 1) {
      $respuesta = array(
        'respuesta' => 'correcto'
      );
    }
    $stmt->close();
    $conn->close();

  } catch(Exception $e) {
    $respuesta = array (
      'error' => $e->getMessage()
    );
  }
  echo json_encode($respuesta);
}
}

if(isset($_POST["accion"]))
{ //Lo agregue de las preguntas seccion 50,clase 417
if($_POST['accion'] == 'editar') {


  require_once('../funciones/bd.php');


  //Validar las entradas

  $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
  $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
  $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
  $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

  try {
    $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ?, telefono = ? WHERE id = ?");
    $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id);
    $stmt->execute();
    if($stmt->affected_rows == 1) {
      $respuesta = array(
        'respuesta' => 'correcto'
      );
    } else {
      $respuesta = array(
        'respuesta' => 'error'
      );
    }
    $stmt->close();
    $conn->close();
  } catch(Exception $e) {
    $respuesta = array(
      'error' => $e->getMessage()
    );
  }
  echo json_encode($respuesta);
}
}
