const canvas = document.getElementById("glitch-bg");
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // ANIMATION CONFIG
        let lastTime = 0;
        const fps = 15; 
        const interval = 1000 / fps;

        function draw(currentTime) {
            requestAnimationFrame(draw);

            if (!currentTime) currentTime = 0;
            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;
            lastTime = currentTime - (deltaTime % interval);

            // Clear Screen
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Grid
            ctx.strokeStyle = '#003300'; // Darker green for background
            ctx.lineWidth = 1;

            // Horizontal
            for (let y = 0; y < canvas.height; y += 40) {
                // Glitch Logic
                if (Math.random() > 0.995) {
                    let yPos = y + (Math.random() * 10 - 5);
                    ctx.strokeStyle = '#39ff14'; // Bright flash
                    ctx.beginPath();
                    ctx.moveTo(0, yPos);
                    ctx.lineTo(canvas.width, yPos);
                    ctx.stroke();
                    ctx.strokeStyle = '#003300'; // Reset
                } else {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }

            // Vertical
            for (let x = 0; x < canvas.width; x += 40) {
                if (Math.random() > 0.995) {
                    let xPos = x + (Math.random() * 10 - 5);
                    ctx.strokeStyle = '#39ff14';
                    ctx.beginPath();
                    ctx.moveTo(xPos, 0);
                    ctx.lineTo(xPos, canvas.height);
                    ctx.stroke();
                    ctx.strokeStyle = '#003300';
                } else {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
            }
        }
        draw(0);