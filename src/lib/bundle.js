/**
 * Harmony Match - Main Bundle
 * Handles UI interactions, form processing, and page functionality
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeaderScroll();
    initZodiacWheel();
    initCompatibilityForm();
    initZodiacPreview();
    initResultsPage();
  });

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    var menuBtn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('nav');

    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', function() {
      var isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');

      // Update button appearance
      if (nav.classList.contains('active')) {
        menuBtn.setAttribute('aria-label', 'Close navigation menu');
      } else {
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  /**
   * Header Scroll Effect
   */
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var scrollThreshold = 50;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial check
  }

  /**
   * Zodiac Wheel Display
   */
  function initZodiacWheel() {
    var wheel = document.getElementById('zodiacWheel');
    if (!wheel || typeof window.ZodiacCalculator === 'undefined') return;

    var data = window.ZodiacCalculator.getZodiacData();
    var html = '';

    data.animals.forEach(function(animal) {
      html += '<div class="zodiac-sign" data-animal="' + animal + '">';
      html += '<span class="zodiac-emoji">' + data.emojis[animal] + '</span>';
      html += '<div class="zodiac-name">' + animal + '</div>';
      html += '<div class="zodiac-chinese">' + data.chinese[animal] + '</div>';
      html += '</div>';
    });

    wheel.innerHTML = html;
  }

  /**
   * Zodiac Preview on Year Input
   */
  function initZodiacPreview() {
    var year1Input = document.getElementById('year1');
    var year2Input = document.getElementById('year2');

    if (year1Input) {
      year1Input.addEventListener('input', function() {
        updateZodiacPreview(1, this.value);
      });
    }

    if (year2Input) {
      year2Input.addEventListener('input', function() {
        updateZodiacPreview(2, this.value);
      });
    }
  }

  function updateZodiacPreview(partnerNum, yearValue) {
    var preview = document.getElementById('zodiac' + partnerNum + 'Preview');
    var emojiEl = document.getElementById('zodiac' + partnerNum + 'Emoji');
    var nameEl = document.getElementById('zodiac' + partnerNum + 'Name');
    var chineseEl = document.getElementById('zodiac' + partnerNum + 'Chinese');

    if (!preview || typeof window.ZodiacCalculator === 'undefined') return;

    var year = parseInt(yearValue, 10);

    if (year && year >= 1920 && year <= new Date().getFullYear()) {
      var profile = window.ZodiacCalculator.getZodiacProfile(year);
      emojiEl.textContent = profile.emoji;
      nameEl.textContent = profile.animal;
      chineseEl.textContent = profile.animalChinese;
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  }

  /**
   * Compatibility Form Handler
   */
  function initCompatibilityForm() {
    var form = document.getElementById('compatibilityForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var year1Input = document.getElementById('year1');
      var year2Input = document.getElementById('year2');
      var year1Error = document.getElementById('year1Error');
      var year2Error = document.getElementById('year2Error');

      // Clear previous errors
      year1Error.classList.add('hidden');
      year2Error.classList.add('hidden');
      year1Error.textContent = '';
      year2Error.textContent = '';

      var year1 = parseInt(year1Input.value, 10);
      var year2 = parseInt(year2Input.value, 10);

      // Validate
      var valid = true;

      if (typeof window.ZodiacCalculator !== 'undefined') {
        var validation1 = window.ZodiacCalculator.validateBirthYear(year1);
        var validation2 = window.ZodiacCalculator.validateBirthYear(year2);

        if (!validation1.valid) {
          year1Error.textContent = validation1.error;
          year1Error.classList.remove('hidden');
          valid = false;
        }

        if (!validation2.valid) {
          year2Error.textContent = validation2.error;
          year2Error.classList.remove('hidden');
          valid = false;
        }
      } else {
        // Fallback validation
        var currentYear = new Date().getFullYear();
        if (!year1 || year1 < 1920 || year1 > currentYear) {
          year1Error.textContent = 'Please enter a valid year between 1920 and ' + currentYear;
          year1Error.classList.remove('hidden');
          valid = false;
        }
        if (!year2 || year2 < 1920 || year2 > currentYear) {
          year2Error.textContent = 'Please enter a valid year between 1920 and ' + currentYear;
          year2Error.classList.remove('hidden');
          valid = false;
        }
      }

      if (valid) {
        // Store data and redirect to results
        sessionStorage.setItem('harmonyMatch', JSON.stringify({
          year1: year1,
          year2: year2,
          timestamp: Date.now()
        }));
        window.location.href = 'results.html';
      }
    });
  }

  /**
   * Results Page Handler
   */
  function initResultsPage() {
    // Check if we're on the results page
    var scoreValue = document.getElementById('scoreValue');
    if (!scoreValue) return;

    // Get stored data
    var storedData = sessionStorage.getItem('harmonyMatch');
    if (!storedData) {
      // No data, redirect to calculator
      window.location.href = 'index.html#calculator';
      return;
    }

    var data = JSON.parse(storedData);
    var year1 = data.year1;
    var year2 = data.year2;

    if (typeof window.ZodiacCalculator === 'undefined') {
      console.error('ZodiacCalculator not loaded');
      return;
    }

    // Calculate compatibility
    var result = window.ZodiacCalculator.calculateCompatibility(year1, year2);

    // Display partner 1
    displayPartner(1, result.partner1);
    displayPartner(2, result.partner2);

    // Display polarity
    var polarityDisplay = document.getElementById('polarityDisplay');
    if (polarityDisplay) {
      polarityDisplay.textContent = result.partner1.polarity + ' + ' + result.partner2.polarity;
    }

    // Animate score
    animateScore(result.scores.overall);

    // Display score level
    var scoreLevel = document.getElementById('scoreLevel');
    var scoreLevelDesc = document.getElementById('scoreLevelDescription');
    if (scoreLevel) scoreLevel.textContent = result.level + ' Compatibility';
    if (scoreLevelDesc) scoreLevelDesc.textContent = result.levelDescription;

    // Display score breakdown
    var animalScore = document.getElementById('animalScore');
    var elementScore = document.getElementById('elementScore');
    var polarityScore = document.getElementById('polarityScore');
    if (animalScore) animalScore.textContent = result.scores.animal + '%';
    if (elementScore) elementScore.textContent = result.scores.element + '%';
    if (polarityScore) polarityScore.textContent = result.scores.polarity + '%';

    // Display element description
    var elementDesc = document.getElementById('elementDescription');
    if (elementDesc && result.elementRelationship) {
      elementDesc.textContent = result.elementRelationship.description;
    }

    // Display polarity description
    var polarityDesc = document.getElementById('polarityDescription');
    if (polarityDesc && result.polarityRelationship) {
      polarityDesc.textContent = result.polarityRelationship.description;
    }

    // Display dynamics tags
    displayDynamicsTags(result.dynamics, result.partner1.animal, result.partner2.animal);

    // Display strengths
    displayStrengths(result);
  }

  function displayPartner(num, profile) {
    var emoji = document.getElementById('partner' + num + 'Emoji');
    var animal = document.getElementById('partner' + num + 'Animal');
    var chinese = document.getElementById('partner' + num + 'Chinese');
    var element = document.getElementById('partner' + num + 'Element');

    if (emoji) emoji.textContent = profile.emoji;
    if (animal) animal.textContent = profile.animal;
    if (chinese) chinese.textContent = profile.animalChinese;
    if (element) {
      element.textContent = profile.element + ' ' + profile.polarity;
      element.style.backgroundColor = profile.elementColor;
    }
  }

  function animateScore(targetScore) {
    var scoreValue = document.getElementById('scoreValue');
    var scoreProgress = document.getElementById('scoreProgress');

    if (!scoreValue || !scoreProgress) return;

    var circumference = 2 * Math.PI * 80; // radius = 80
    var offset = circumference - (targetScore / 100) * circumference;

    // Animate the progress circle
    setTimeout(function() {
      scoreProgress.style.strokeDashoffset = offset;
    }, 100);

    // Animate the number
    var current = 0;
    var duration = 1500;
    var step = targetScore / (duration / 16);

    function updateNumber() {
      current += step;
      if (current >= targetScore) {
        scoreValue.textContent = targetScore;
      } else {
        scoreValue.textContent = Math.round(current);
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function displayDynamicsTags(dynamics, animal1, animal2) {
    var container = document.getElementById('dynamicsTags');
    if (!container) return;

    var tags = [];

    if (dynamics.isTrineMatch) {
      tags.push({ text: 'Trine Match', type: 'positive', icon: '\u2605' });
    }
    if (dynamics.isSecretFriend) {
      tags.push({ text: 'Secret Friends', type: 'positive', icon: '\u2661' });
    }
    if (dynamics.isClash) {
      tags.push({ text: 'Opposite Signs', type: 'negative', icon: '\u26A0' });
    }
    if (dynamics.isSameAnimal) {
      tags.push({ text: 'Same Sign', type: 'neutral', icon: '\u267E' });
    }
    if (dynamics.isSameElement) {
      tags.push({ text: 'Shared Element', type: 'neutral', icon: '\u2734' });
    }

    var html = '';
    tags.forEach(function(tag) {
      html += '<span class="dynamics-tag ' + tag.type + '">';
      html += '<span>' + tag.icon + '</span> ' + tag.text;
      html += '</span>';
    });

    container.innerHTML = html;
  }

  function displayStrengths(result) {
    var container = document.getElementById('strengthsContent');
    if (!container) return;

    var strengths = [];

    if (result.dynamics.isTrineMatch) {
      strengths.push('Natural understanding and shared values between ' + result.partner1.animal + ' and ' + result.partner2.animal);
      strengths.push('Similar approaches to life goals and ambitions');
    }

    if (result.dynamics.isSecretFriend) {
      strengths.push('A deep, private bond that others may not see');
      strengths.push('Intuitive understanding of each other\'s needs');
    }

    if (result.polarityRelationship.balanced) {
      strengths.push('Complementary Yin-Yang energies create natural balance');
    }

    if (result.elementRelationship.relationship === 'generating') {
      strengths.push(result.partner1.element + ' naturally supports and nurtures ' + result.partner2.element);
    }

    if (result.elementRelationship.relationship === 'receiving') {
      strengths.push(result.partner2.element + ' provides nurturing energy to ' + result.partner1.element);
    }

    if (result.elementRelationship.relationship === 'same') {
      strengths.push('Shared ' + result.partner1.element + ' element creates deep understanding');
    }

    // Always add some general strengths based on score
    if (result.scores.overall >= 70) {
      strengths.push('Strong foundation for long-term harmony');
      strengths.push('Natural chemistry and attraction');
    } else if (result.scores.overall >= 50) {
      strengths.push('Potential for growth through understanding differences');
      strengths.push('Opportunity to learn from each other\'s perspectives');
    }

    if (strengths.length === 0) {
      strengths.push('Every relationship has unique strengths to discover');
      strengths.push('Growth comes from understanding and accepting differences');
    }

    var html = '<ul>';
    strengths.forEach(function(strength) {
      html += '<li>' + strength + '</li>';
    });
    html += '</ul>';

    container.innerHTML = html;
  }

})();
