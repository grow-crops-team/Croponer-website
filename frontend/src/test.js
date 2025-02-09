window.addEventListener('scroll', function() {
    const section = document.querySelector('.hero-section');
    const tagline = document.querySelector('.tagline');
    const scrollPosition = window.scrollY + window.innerHeight;
    const sectionPosition = section.offsetTop + section.offsetHeight;
  
    if (scrollPosition >= sectionPosition) {
      section.classList.add('bg-white');
      tagline.classList.remove('opacity-0');
      tagline.classList.add('opacity-100');
    }
  });
  