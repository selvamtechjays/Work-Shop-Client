import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('CSS Styling Tests', () => {
  let dom;
  let document;
  let styleSheet;

  beforeAll(() => {
    // Read the CSS file
    const cssPath = path.resolve(__dirname, './main.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Create a JSDOM instance
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssContent}</style>
        </head>
        <body>
          <div class="main-content">
            <div class="left-column">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
            </div>
            <div class="right-column">
              <h2>Form Heading</h2>
              <div class="form-group">
                <label for="test">Label</label>
                <input type="text" id="test" />
              </div>
              <button class="login-button">Submit</button>
              <p class="text">
                Text <a href="#" class="signup-link">Link</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `);

    document = dom.window.document;
    styleSheet = document.styleSheets[0];
  });

  describe('CSS Custom Properties', () => {
    it('should define root CSS variables', () => {
      const rootStyle = dom.window.getComputedStyle(document.documentElement);

      // Check primary colors
      expect(rootStyle.getPropertyValue('--primary-color').trim()).toBe('#6366f1');
      expect(rootStyle.getPropertyValue('--primary-dark').trim()).toBe('#4f46e5');
      expect(rootStyle.getPropertyValue('--primary-light').trim()).toBe('#818cf8');

      // Check accent color
      expect(rootStyle.getPropertyValue('--accent-color').trim()).toBe('#a855f7');

      // Check semantic colors
      expect(rootStyle.getPropertyValue('--success-color').trim()).toBe('#22c55e');
      expect(rootStyle.getPropertyValue('--error-color').trim()).toBe('#ef4444');

      // Check neutral colors
      expect(rootStyle.getPropertyValue('--bg-color').trim()).toBe('#ffffff');
      expect(rootStyle.getPropertyValue('--surface-color').trim()).toBe('#f8fafc');
      expect(rootStyle.getPropertyValue('--text-color').trim()).toBe('#1e293b');
      expect(rootStyle.getPropertyValue('--text-muted').trim()).toBe('#64748b');
    });

    it('should define interactive colors', () => {
      const rootStyle = dom.window.getComputedStyle(document.documentElement);

      expect(rootStyle.getPropertyValue('--link-color').trim()).toBe('#6366f1');
      expect(rootStyle.getPropertyValue('--link-hover').trim()).toBe('#4f46e5');
      expect(rootStyle.getPropertyValue('--border-color').trim()).toBe('#e2e8f0');
      expect(rootStyle.getPropertyValue('--focus-color').trim()).toBe('#6366f1');
    });

    it('should define gradient variables', () => {
      const rootStyle = dom.window.getComputedStyle(document.documentElement);

      const gradientPrimary = rootStyle.getPropertyValue('--gradient-primary').trim();
      const gradientAccent = rootStyle.getPropertyValue('--gradient-accent').trim();

      expect(gradientPrimary).toContain('linear-gradient');
      expect(gradientPrimary).toContain('#6366f1');
      expect(gradientPrimary).toContain('#8b5cf6');

      expect(gradientAccent).toContain('linear-gradient');
      expect(gradientAccent).toContain('#a855f7');
      expect(gradientAccent).toContain('#6366f1');
    });

    it('should define primary color RGB value', () => {
      const rootStyle = dom.window.getComputedStyle(document.documentElement);

      const rgbValue = rootStyle.getPropertyValue('--primary-color-rgb').trim();
      // JSDOM may remove spaces, so check for both formats
      expect(rgbValue === '99, 102, 241' || rgbValue === '99,102,241').toBe(true);
    });
  });

  describe('Main Content Styling', () => {
    it('should style main-content with new gradient', () => {
      const mainContent = document.querySelector('.main-content');
      const styles = dom.window.getComputedStyle(mainContent);

      expect(styles.display).toBe('grid');
      // JSDOM may return rgb() instead of 'white'
      expect(styles.color === 'white' || styles.color === 'rgb(255, 255, 255)').toBe(true);
      expect(styles.borderRadius).toBe('20px');
    });

    it('should have box-shadow on main-content', () => {
      const mainContent = document.querySelector('.main-content');
      const styles = dom.window.getComputedStyle(mainContent);

      expect(styles.boxShadow).toBeTruthy();
    });
  });

  describe('Form Container (Right Column) Styling', () => {
    it('should style right-column with modern card appearance', () => {
      const rightColumn = document.querySelector('.right-column');
      const styles = dom.window.getComputedStyle(rightColumn);

      expect(styles.display).toBe('flex');
      expect(styles.flexDirection).toBe('column');
      expect(styles.alignItems).toBe('center');
      expect(styles.borderRadius).toBe('16px');
      // Check borderStyle instead of border shorthand
      expect(styles.borderStyle === 'none' || styles.border === 'none').toBe(true);
    });

    it('should have increased padding on right-column', () => {
      const rightColumn = document.querySelector('.right-column');
      const styles = dom.window.getComputedStyle(rightColumn);

      expect(styles.padding).toBe('40px 30px');
    });

    it('should have box-shadow on right-column', () => {
      const rightColumn = document.querySelector('.right-column');
      const styles = dom.window.getComputedStyle(rightColumn);

      expect(styles.boxShadow).toBeTruthy();
    });
  });

  describe('Form Input Styling', () => {
    it('should style form inputs with modern appearance', () => {
      const input = document.querySelector('.form-group input');
      const styles = dom.window.getComputedStyle(input);

      expect(styles.padding).toBe('12px 16px');
      expect(styles.borderRadius).toBe('8px');
      expect(styles.fontSize).toBe('16px');
      // JSDOM may return rgb() format
      expect(styles.backgroundColor === '#ffffff' || styles.backgroundColor === 'rgb(255, 255, 255)').toBe(true);
    });

    it('should have transition on inputs', () => {
      const input = document.querySelector('.form-group input');
      const styles = dom.window.getComputedStyle(input);

      expect(styles.transition).toContain('all');
      expect(styles.transition).toContain('0.2s');
      expect(styles.transition).toContain('ease');
    });

    it('should have border styling on inputs', () => {
      // Check that the CSS rule exists rather than computed value
      // JSDOM doesn't always compute border properties correctly
      let hasBorderRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.form-group input')) {
          if (rule.style.border && rule.style.border.includes('2px')) {
            hasBorderRule = true;
            break;
          }
        }
      }

      expect(hasBorderRule).toBe(true);
    });
  });

  describe('Form Label Styling', () => {
    it('should style labels with proper hierarchy', () => {
      const label = document.querySelector('.form-group label');
      const styles = dom.window.getComputedStyle(label);

      expect(styles.marginBottom).toBe('8px');
      expect(styles.fontWeight).toBe('500');
      expect(styles.fontSize).toBe('14px');
    });
  });

  describe('Button Styling', () => {
    it('should style login-button with new design', () => {
      const button = document.querySelector('.login-button');
      const styles = dom.window.getComputedStyle(button);

      expect(styles.padding).toBe('14px 24px');
      expect(styles.borderRadius).toBe('8px');
      // Check borderStyle instead of border shorthand
      expect(styles.borderStyle === 'none' || styles.border === 'none').toBe(true);
      expect(styles.fontSize).toBe('16px');
      expect(styles.fontWeight).toBe('600');
      // JSDOM may return rgb() format
      expect(styles.color === 'white' || styles.color === 'rgb(255, 255, 255)').toBe(true);
    });

    it('should have transition on button', () => {
      const button = document.querySelector('.login-button');
      const styles = dom.window.getComputedStyle(button);

      expect(styles.transition).toContain('all');
      expect(styles.transition).toContain('0.2s');
      expect(styles.transition).toContain('ease');
    });

    it('should have cursor pointer on button', () => {
      const button = document.querySelector('.login-button');
      const styles = dom.window.getComputedStyle(button);

      expect(styles.cursor).toBe('pointer');
    });
  });

  describe('Link Styling', () => {
    it('should style signup-link', () => {
      const link = document.querySelector('.signup-link');
      const styles = dom.window.getComputedStyle(link);

      expect(styles.fontWeight).toBe('500');
    });

    it('should have transition on signup-link', () => {
      const link = document.querySelector('.signup-link');
      const styles = dom.window.getComputedStyle(link);

      expect(styles.transition).toContain('all');
      expect(styles.transition).toContain('0.2s');
      expect(styles.transition).toContain('ease');
    });
  });

  describe('Typography Hierarchy', () => {
    it('should style left-column h1', () => {
      const h1 = document.querySelector('.left-column h1');
      const styles = dom.window.getComputedStyle(h1);

      expect(styles.fontSize).toBe('42px');
      expect(styles.fontWeight).toBe('700');
      expect(styles.lineHeight).toBe('1.2');
      expect(styles.marginBottom).toBe('16px');
    });

    it('should style left-column h2', () => {
      const h2 = document.querySelector('.left-column h2');
      const styles = dom.window.getComputedStyle(h2);

      expect(styles.fontSize).toBe('20px');
      expect(styles.fontWeight).toBe('400');
      expect(styles.lineHeight).toBe('1.6');
      expect(styles.opacity).toBe('0.9');
    });

    it('should style right-column h2', () => {
      const h2 = document.querySelector('.right-column h2');
      const styles = dom.window.getComputedStyle(h2);

      expect(styles.fontSize).toBe('28px');
      expect(styles.fontWeight).toBe('600');
      expect(styles.marginBottom).toBe('24px');
    });

    it('should style right-column .text', () => {
      const text = document.querySelector('.right-column .text');
      const styles = dom.window.getComputedStyle(text);

      expect(styles.fontSize).toBe('14px');
      expect(styles.marginTop).toBe('16px');
    });
  });

  describe('CSS Rules Existence', () => {
    it('should have focus state for inputs', () => {
      let hasFocusRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.form-group input:focus')) {
          hasFocusRule = true;
          expect(rule.style.outline).toBe('none');
          break;
        }
      }

      expect(hasFocusRule).toBe(true);
    });

    it('should have hover state for inputs', () => {
      let hasHoverRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.form-group input:hover')) {
          hasHoverRule = true;
          break;
        }
      }

      expect(hasHoverRule).toBe(true);
    });

    it('should have hover state for button', () => {
      let hasHoverRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.login-button:hover')) {
          hasHoverRule = true;
          break;
        }
      }

      expect(hasHoverRule).toBe(true);
    });

    it('should have active state for button', () => {
      let hasActiveRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.login-button:active')) {
          hasActiveRule = true;
          break;
        }
      }

      expect(hasActiveRule).toBe(true);
    });

    it('should have focus state for button', () => {
      let hasFocusRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.login-button:focus')) {
          hasFocusRule = true;
          break;
        }
      }

      expect(hasFocusRule).toBe(true);
    });

    it('should have hover state for signup-link', () => {
      let hasHoverRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes('.signup-link:hover')) {
          hasHoverRule = true;
          break;
        }
      }

      expect(hasHoverRule).toBe(true);
    });

    it('should have focus-visible accessibility rule', () => {
      let hasFocusVisibleRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText && rule.selectorText.includes(':focus-visible')) {
          hasFocusVisibleRule = true;
          // JSDOM may not fully parse outline shorthand, just verify the rule exists
          expect(rule.style.outline || rule.style.outlineWidth).toBeTruthy();
          break;
        }
      }

      expect(hasFocusVisibleRule).toBe(true);
    });

    it('should have prefers-reduced-motion media query', () => {
      let hasReducedMotionRule = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.media && rule.media.mediaText.includes('prefers-reduced-motion')) {
          hasReducedMotionRule = true;
          break;
        }
      }

      expect(hasReducedMotionRule).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('should have media query for max-width 800px', () => {
      let has800pxMediaQuery = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.media && rule.media.mediaText.includes('800px')) {
          has800pxMediaQuery = true;
          break;
        }
      }

      expect(has800pxMediaQuery).toBe(true);
    });

    it('should have media query for max-width 768px', () => {
      let has768pxMediaQuery = false;

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.media && rule.media.mediaText.includes('768px')) {
          has768pxMediaQuery = true;
          break;
        }
      }

      expect(has768pxMediaQuery).toBe(true);
    });
  });
});
