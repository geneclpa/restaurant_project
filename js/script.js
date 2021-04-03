'use strict';

/*  Menu  */
((d) => {

    const $btn_menu = d.querySelector('.menu_btn'),
        $menu = d.querySelector('.menu');

    $btn_menu.addEventListener('click', (e) => {
        $btn_menu.firstElementChild.classList.toggle('none');
        $btn_menu.lastElementChild.classList.toggle('none');

        $menu.classList.toggle('is_active');
    });

    d.addEventListener('click', (e) => {
        if(!e.target.matches('.menu a')) return false;

        $btn_menu.firstElementChild.classList.remove('none');
        $btn_menu.lastElementChild.classList.add('none');

        $menu.classList.remove('is_active');
    });

})(document);

/*  Reserve Form  */
((d) => {

    d.addEventListener('DOMContentLoaded', e => {

        check_form('#form_reserve');

        check_form('#form_contact');

    });

    d.addEventListener('click', e => {

        if(e.target.value === 'Reservar') send_form('#form_reserve', '.loader_reserve', '.reserve_form_response',  '#mensaje_reserva');

        if(e.target.value === 'Enviar') send_form('#form_contact', '.loader_contact', '.contact_form_response',  '#mensaje_contacto');

    });

    /*  Función de chequear los campos del formularios  */
    const check_form = (form) => {

        const $inputs = d.querySelectorAll(`${form} [required]`);

        /*  Creación dinámica de los elementos donde se mostraran los errores en caso de que hayan para cada campo de los formularios  */
        $inputs.forEach(input => {

            const $error = d.createElement('span');

            $error.id = `error-${input.name}`;
            $error.textContent = input.title;
            $error.classList.add('input_error', 'none');
            input.insertAdjacentElement('afterend', $error);

        });

        /*  Evento para verificar si el campo tiene o no información al entrar en el  */
        d.addEventListener('focusin', e => {

            /*  Ubicamos los elementos necesarios  */
            let $input = e.target;

            /*  En el caso de que el campo sea requerido  */
            if($input.matches(`${form} [required]`)){
                
                /*  Se evalua si hay caracteres en el campo, en el caso de que no se oculta el mensaje de error  */
                if($input.value.length === 0) d.getElementById(`error-${$input.name}`).classList.remove('is-active');

            }

        });

        /*  Evento para verificar si el campo tiene o no información, en el caso de que no se oculta el mensaje de error  */
        d.addEventListener('keyup', e => {

            /*  Ubicamos los elementos necesarios  */
            let $input = e.target;

            /*  En el caso de que el campo sea requerido  */
            if($input.matches(`${form} [required]`)){

                /*  Se evalua si hay caracteres en el campo, en el caso de que no se oculta el mensaje de error  */
                $input.value.length === 0 ? d.getElementById(`error-${$input.name}`).classList.add('is-active') : d.getElementById(`error-${$input.name}`).classList.remove('is-active');

            }

        });

        /*  Evento para activar la validación de un campo de formulario al dejarlo  */
        d.addEventListener('focusout', e => {

            /*  Ubicamos los elementos necesarios  */
            let $input = e.target,
                pattern = $input.pattern,
                result = '';

            if($input.matches(`${form} [required]`)){

                /*  Se evalua si hay patrón y el campo tiene información  */
                if(pattern && $input.value !== ''){
        
                    let regex = new RegExp(pattern);
                    
                    result = !regex.exec($input.value) ? d.getElementById(`error-${$input.name}`).classList.add('is-active') : d.getElementById(`error-${$input.name}`).classList.remove('is-active');
        
                }else{

                    d.getElementById(`error-${$input.name}`).classList.add('is-active')

                }
        
                /*  Se evalua si hay un campo que tenga el valor de requerido pero no tiene un patrón  */
                if(!pattern) result = $input.value === '' ? d.getElementById(`error-${$input.name}`).classList.add('is-active') : d.getElementById(`error-${$input.name}`).classList.remove('is-active');
        
                return result;

            }

        });

    }

    /*  Función para el envío del formulario  */
    const send_form = (form, loader, response, message) => {

        const $form = d.querySelector(form),
            $loader = d.querySelector(loader),
            $response = d.querySelector(response);

        $form.addEventListener('submit', e => {

            e.preventDefault();

            $loader.classList.remove('none');

            fetch('https://formsubmit.co/ajax/geneluengo@gmail.com', {

                method: 'POST',
                body: new FormData(e.target)

            })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(json => {
                
                location.hash = message;
                $form.reset();

            })
            .catch(err => {

                console.log(err);

                let message = err.statusText || 'Ocurrió un error al enviar, intenta nuevamente';
                $response.querySelector('h3').innerHTML = 'Error:';
                $response.querySelector('p').innerHTML = `${err.status}: ${message}`;
            
            })
            .finally(() => {
                
                $loader.classList.add('none');
                setTimeout(() => {

                    location.hash = '#cerrar';

                }, 3000);

            });

        });

    }

})(document);
