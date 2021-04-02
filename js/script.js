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

((d) => {

    d.addEventListener('DOMContentLoaded', e => {

        form_validation('#form_reserve', '.loader_reserve', '.reserve_form_response', '.btn');

        form_validation('#form_contact', '.loader_contact', '.contact_form_response', '.btn');
    
    });

    /*  Función para validar los formularios  */
    const form_validation = (form, loader, response, btn) => {
    
        /*  Ubicamos el formulario y los campos requeridos  */
        const $form = d.querySelector(form),
            $inputs = d.querySelectorAll(`${form} [required]`),
            $loader = d.querySelector(loader),
            $response = d.querySelector(response),
            $btn = d.querySelector(btn);
    
        /*  Creación dinámica de los elementos donde se mostraran los errores en caso de que hayan para cada campo de los formularios  */
        $inputs.forEach(input => {
    
            const $error = d.createElement('span');

            $error.id = `error-${input.name}`;
            $error.textContent = input.title;
            $error.classList.add('none', 'input_error');
            input.insertAdjacentElement('afterend', $error);
    
        });

        /*  Evento para verificar si el campo tiene o no información al entrar en el  */
        d.addEventListener('focusin', e => {

            /*  Ubicamos los elementos necesarios  */
            let $input = e.target;

            /*  En el caso de que el campo sea requerido  */
            if(e.target.matches(`${form} [required]`)){

                /*  Se evalua si hay caracteres en el campo, en el caso de que no se oculta el mensaje de error  */
                if($input.value.length === 0) d.getElementById(`error-${$input.name}`).classList.remove('is-active');

            }

        });

    
        /*  Evento para verificar si el campo tiene o no información, en el caso de que no se oculta el mensaje de error  */
        d.addEventListener('keyup', e => {
    
            /*  Ubicamos los elementos necesarios  */
            let $input = e.target,
            result = '';
    
            /*  En el caso de que el campo sea requerido  */
            if(e.target.matches(`${form} [required]`)){
    
                /*  Se evalua si hay caracteres en el campo, en el caso de que no se oculta el mensaje de error  */
                if($input.value.length === 0) result = d.getElementById(`error-${$input.name}`).classList.remove('is-active');
    
            }else{
    
                /*  En el caso de que el campo no sea requerido  */
                if(d.getElementById(`error-${$input.name}`) !== null){
    
                    /*  Se evalua si hay caracteres en el campo, en el caso de que no se oculta el mensaje de error  */
                    if($input.value.length === 0) result = d.getElementById(`error-${$input.name}`).classList.remove('is-active');
    
                }
    
            }
    
        });
    
        /*  Evento para activar la validación de un campo de formulario al dejarlo  */
        d.addEventListener('focusout', e => {
    
            /*  Ubicamos los elementos necesarios  */
            let $input = e.target,
            pattern = $input.pattern,
            result = '';
    
            if(e.target.matches(`${form} [required]`)){
    
                /*  Se evalua si hay patrón y el campo tiene información  */
                if(pattern && $input.value !== ''){
    
                    let regex = new RegExp(pattern);
                    
                    result = !regex.exec($input.value) ? d.getElementById(`error-${$input.name}`).classList.add('is-active') : d.getElementById(`error-${$input.name}`).classList.remove('is-active');
    
                }
    
                /*  Se evalua si hay un campo que no tenga el valor de requerido  */
                if(!pattern) result = $input.value === '' ? d.getElementById(`error-${$input.name}`).classList.add('is-active') : d.getElementById(`error-${$input.name}`).classList.remove('is-active');
    
                return result;
    
            }
    
        });
    
        /*  Evento al enviar el formulario  */
        d.addEventListener('submit', e => {
    
            e.preventDefault();
    
            /*  Ubicamos los elementos necesarios  */
            const $btn_form = d.querySelector($btn);
    
            /*  Se habilita el loader  */
            $loader.classList.remove('none');
            $btn_form.setAttribute('disabled', '');
    
            /*  Petición ajax  */
            fetch('https://formsubmit.co/ajax/geneluengo@gmail.com', {
    
                method: 'POST',
                body: new FormData(e.target)
            
            })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(json => {
    
                location.hash = '#mensaje_reserva';
                $form.reset();
    
            })
            .catch(err => {
    
                let err_message = err.statusText || 'Ocurrió un error al enviar el formulario. Por favor intente de nuevo';
                $response.querySelector('h3').innerHTML = 'Error';
                $response.querySelector('p').innerHTML = `Error: ${err.status} - ${err_message}`;
            
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
