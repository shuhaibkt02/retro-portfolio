const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const binary = '01';
    
    const alphabet = binary;
    
    const fontSize = 10;
    const columns = canvas.width/fontSize;
    
    const rainDrops = [];
    
    for( let x = 0; x < columns; x++ ) {
      rainDrops[x] = 1;
    }
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      
      for(let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i*fontSize, rainDrops[i]*fontSize);
        
        if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };
    
 
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.progress');
    const container = document.querySelector('.container');
    
    let width = 0;
    const progressInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          loader.classList.add('hide');
          setTimeout(() => {
            container.classList.add('show');
            loader.style.display = 'none';
          }, 800);
        }, 500);
      } else {
        width += Math.random() * 10;
        if (width > 100) width = 100;
        progress.style.width = width + '%';
      }
    }, 200);
    
    
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
         
          if (entry.target.id === 'skills') {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
              setTimeout(() => {
             
                bar.style.boxShadow = '0 0 15px var(--neon-green)';
                
                
                setTimeout(() => {
                  bar.style.width = '5%';
                  
                  // Audio feedback (optional, commented out by default)
                   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                   const oscillator = audioContext.createOscillator();
                   oscillator.type = 'square';
                   oscillator.frequency.value = 500 + (index * 100);
                   const gainNode = audioContext.createGain();
                   gainNode.gain.value = 0.05;
                   oscillator.connect(gainNode);
                   gainNode.connect(audioContext.destination);
                   oscillator.start();
                   setTimeout(() => oscillator.stop(), 1000);
                  
              
                  let currentWidth = 5;
                  const targetWidth = parseInt(bar.getAttribute('data-width'));
                  const interval = setInterval(() => {
                    currentWidth += Math.ceil((targetWidth - currentWidth) / 10) + 1;
                    if (currentWidth >= targetWidth) {
                      currentWidth = targetWidth;
                      clearInterval(interval);
                  
                      bar.style.transform = 'scaleX(1.03)';
                      setTimeout(() => {
                        bar.style.transform = 'scaleX(1)';
                      }, 150);
                    }
                    bar.style.width = currentWidth + '%';
                  }, 60);
                  
                  
                  const dataIndicator = document.createElement('div');
                  dataIndicator.classList.add('data-indicator');
                  dataIndicator.style.position = 'absolute';
                  dataIndicator.style.right = '5px';
                  dataIndicator.style.top = '-20px';
                  dataIndicator.style.color = 'var(--neon-green)';
                  dataIndicator.style.fontSize = '0.7rem';
                  dataIndicator.style.fontWeight = 'bold';
                  dataIndicator.style.textShadow = '0 0 5px var(--neon-green)';
                  bar.parentNode.style.position = 'relative';
                  bar.parentNode.appendChild(dataIndicator);
                  
                  const updateIndicator = setInterval(() => {
                    const percent = parseInt(bar.style.width);
                    dataIndicator.textContent = percent + '%';
                    if (percent >= targetWidth) {
                      clearInterval(updateIndicator);
                    }
                  }, 60);
                  
                }, 300 + (index * 150));
              }, 300);
            });
          }
        }
      });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    

    setInterval(drawMatrix, 50);
    
 
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    

    document.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
      });
    });
