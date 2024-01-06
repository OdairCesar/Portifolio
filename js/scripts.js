document.addEventListener('DOMContentLoaded', () => {
    let body = document.querySelector('body');
    const cardsWork = document.querySelectorAll('.card-work')
    const cardsLearn = document.querySelectorAll('.card-learn')
    const cardsExperience = document.querySelectorAll('.card-experience')
    const sections = document.querySelectorAll('section[id]')
    const imagesLoadding = document.querySelectorAll('.img-loadding')

    body.addEventListener('mousemove', (event) => {
        let pointerMove = document.getElementById('mouse-move')

        positionX = event.clientX - body.getBoundingClientRect().left - (pointerMove.clientWidth / 3)
        positionY = event.clientY - body.getBoundingClientRect().top - (pointerMove.clientHeight / 3)
        if (pointerMove) pointerMove.style.transform = `translateX(${positionX - 250}px) translateY(${positionY - 250}px)`;
    })

    cardsWork.forEach(card => {
        card.addEventListener('mouseover', () => {
            console.log('sou o mouse move')

            cardsWork.forEach(cardWork => {
                cardWork.dataset.workkey != card.dataset.workkey ? cardWork.classList.add('opacit') : cardWork.classList.remove('opacit')
            })
        })

        card.addEventListener('mouseout', () => {
            cardsWork.forEach(cardWork => {
                cardWork.classList.remove('opacit')
            })
        })
    })

    cardsLearn.forEach(card => {
        card.addEventListener('mouseover', () => {
            console.log('sou o mouse move')

            cardsLearn.forEach(cardLearn => {
                cardLearn.dataset.learnkey != card.dataset.learnkey ? cardLearn.classList.add('opacit') : cardLearn.classList.remove('opacit')
            })
        })

        card.addEventListener('mouseout', () => {
            cardsLearn.forEach(cardLearn => {
                cardLearn.classList.remove('opacit')
            })
        })
    })

    cardsExperience.forEach(card => {
        card.addEventListener('mouseover', () => {
            console.log('sou o mouse move')

            cardsExperience.forEach(cardExperience => {
                cardExperience.dataset.experiencekey != card.dataset.experiencekey ? cardExperience.classList.add('opacit') : cardExperience.classList.remove('opacit')
            })
        })

        card.addEventListener('mouseout', () => {
            cardsExperience.forEach(cardExperience => {
                cardExperience.classList.remove('opacit')
            })
        })
    })

    document.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset

        sections.forEach(current =>{
            const sectionHeight = current.offsetHeight,
                sectionTop = current.offsetTop - 58,
                sectionId = current.getAttribute('id')

            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                document.querySelector('.wrapper__nav__fixed__topo__nav__item__link[href*=' + sectionId + ']').classList.add('active')
            }else{
                document.querySelector('.wrapper__nav__fixed__topo__nav__item__link[href*=' + sectionId + ']').classList.remove('active')
            }
        })

        imagesLoadding.forEach(image => {
            let posicoes = image.getBoundingClientRect();
            let inicio = posicoes.top;
            let fim = posicoes.bottom;

            if (inicio >= 0 && fim <= window.innerHeight) {
                if (image.dataset.src) {
                    image.src = image.dataset.src
                }
                image.removeAttribute('data-gif')
                image.removeAttribute('data-src')
            }
        })
    })
}) 

function openImage(gallery, id) {
    const imgs = document.querySelectorAll(`[data-image]`)
    console.log(imgs)

    imgs.forEach(img => {
        if (img.dataset.image === `${gallery+id}`) {
            img.classList.add('active')
            img.classList.remove('hidden')
        } else {
            img.classList.add('hidden')
            img.classList.remove('active')
        }
    })
}