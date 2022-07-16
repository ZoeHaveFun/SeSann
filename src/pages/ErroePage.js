/* eslint-disable func-names */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-use-before-define */
/* eslint-disable new-cap */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable max-len */

import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/css/ErrorPage.css';

function PageNotFound() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext('2d');
    const bubbles = [];
    const bubbleCount = 60;
    const bubbleSpeed = 1.5;
    const popLines = 6;
    let popDistance = 40;
    const mouseOffset = {
      x: 0,
      y: 0,
    };
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      for (let i = 0; i < bubbles.length; i += 1) {
        bubbles[i].position.x = Math.sin(bubbles[i].count / bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff;
        bubbles[i].position.y = bubbles[i].count;
        bubbles[i].render();

        if (bubbles[i].count < 0 - bubbles[i].radius) {
          bubbles[i].count = canvas.height + bubbles[i].yOff;
        } else {
          bubbles[i].count -= bubbleSpeed;
        }
      }

      for (let i = 0; i < bubbles.length; i += 1) {
        if (mouseOffset.x > bubbles[i].position.x - bubbles[i].radius && mouseOffset.x < bubbles[i].position.x + bubbles[i].radius) {
          if (mouseOffset.y > bubbles[i].position.y - bubbles[i].radius && mouseOffset.y < bubbles[i].position.y + bubbles[i].radius) {
            for (let a = 0; a < bubbles[i].lines.length; a += 1) {
              popDistance = bubbles[i].radius * 0.5;
              bubbles[i].lines[a].popping = true;
              bubbles[i].popping = true;
            }
          }
        }
      }

      window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);

    const createBubble = function () {
      this.position = { x: 0, y: 0 };
      this.radius = 8 + Math.random() * 6;
      this.xOff = Math.random() * canvas.width - this.radius;
      this.yOff = Math.random() * canvas.height;
      this.distanceBetweenWaves = 50 + Math.random() * 40;
      this.count = canvas.height + this.yOff;
      this.color = '#8bc9ee';
      this.lines = [];
      this.popping = false;
      this.maxRotation = 300;
      this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1);
      this.rotationDirection = 'forward';

      for (let i = 0; i < popLines; i += 1) {
        const tempLine = new createLine();
        tempLine.bubble = this;
        tempLine.index = i;

        this.lines.push(tempLine);
      }

      this.resetPosition = function () {
        this.position = { x: 0, y: 0 };
        this.radius = 8 + Math.random() * 6;
        this.xOff = Math.random() * canvas.width - this.radius;
        this.yOff = Math.random() * canvas.height;
        this.distanceBetweenWaves = 50 + Math.random() * 40;
        this.count = canvas.height + this.yOff;
        this.popping = false;
      };

      this.render = function () {
        if (this.rotationDirection === 'forward') {
          if (this.rotation < this.maxRotation) {
            this.rotation += 1;
          } else {
            this.rotationDirection = 'backward';
          }
        } else if (this.rotation > this.maxRotation * -1) {
          this.rotation -= 1;
        } else {
          this.rotationDirection = 'forward';
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (!this.popping) {
          ctx.beginPath();
          ctx.strokeStyle = '#DDE1E4';
          ctx.lineWidth = 1;
          ctx.arc(0, 0, this.radius - 3, 0, Math.PI * 1.5, true);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
          ctx.stroke();
        }

        ctx.restore();

        for (let a = 0; a < this.lines.length; a += 1) {
          if (this.lines[a].popping) {
            if (this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
              this.lines[a].popDistance += 0.06;
            } else if (this.lines[a].popDistance >= 0) {
              this.lines[a].inversePop = true;
              this.lines[a].popDistanceReturn += 1;
              this.lines[a].popDistance -= 0.03;
            } else {
              this.lines[a].resetValues();
              this.resetPosition();
            }

            this.lines[a].updateValues();
            this.lines[a].render();
          }
        }
      };
    };

    for (let i = 0; i < bubbleCount; i += 1) {
      const tempBubble = new createBubble();

      bubbles.push(tempBubble);
    }

    function createLine() {
      this.lineLength = 0;
      this.popDistance = 0;
      this.popDistanceReturn = 0;
      this.inversePop = false;
      this.popping = false;

      this.resetValues = function () {
        this.lineLength = 0;
        this.popDistance = 0;
        this.popDistanceReturn = 0;
        this.inversePop = false;
        this.popping = false;

        this.updateValues();
      };

      this.updateValues = function () {
        this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) * Math.cos(2 * Math.PI * this.index / this.bubble.lines.length);
        this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) * Math.sin(2 * Math.PI * this.index / this.bubble.lines.length);
        this.lineLength = this.bubble.radius * this.popDistance;
        this.endX = this.lineLength;
        this.endY = this.lineLength;
      };

      this.render = function () {
        this.updateValues();

        ctx.beginPath();
        ctx.strokeStyle = '#DDE1E4';
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        if (this.x < this.bubble.position.x) {
          this.endX = this.lineLength * -1;
        }
        if (this.y < this.bubble.position.y) {
          this.endY = this.lineLength * -1;
        }
        if (this.y === this.bubble.position.y) {
          this.endY = 0;
        }
        if (this.x === this.bubble.position.x) {
          this.endX = 0;
        }
        ctx.lineTo(this.x + this.endX, this.y + this.endY);
        ctx.stroke();
      };
      canvas.addEventListener('mousemove', mouseMove);

      function mouseMove(e) {
        mouseOffset.x = e.offsetX;
        mouseOffset.y = e.offsetY;
      }

      window.addEventListener('resize', () => {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
      });
    }
  }, []);
  return (
    <div className="errorPagewrapper">
      <div className="instructions">
        <h1>404</h1>
        <p>喔 看來你掉進泡泡中了</p>
        <Link to="/">
          <button type="button">我帶你回去吧</button>
        </Link>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}

export default PageNotFound;
