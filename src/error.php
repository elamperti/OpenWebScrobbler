<?php

    require_once('inc/init.php');

    if(isset($_GET['e'])) {
        $error = intval($_GET['e']);
        if (!in_array($error, array(403, 404, 500))) {
            $error = 403;
        }
    } else {
        $error = 404;
    }

    render('error', array('error_number' => $error));

?>
