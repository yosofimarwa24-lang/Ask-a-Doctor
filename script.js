    const navLinks = document.querySelectorAll('.nav-link');

 navLinks.forEach(link => {

        link.addEventListener('click', function() {

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');

        });

    });


    // Smooth scrolling

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {

            const target = document.querySelector(
                this.getAttribute('href')
            );

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }

        });

    });

