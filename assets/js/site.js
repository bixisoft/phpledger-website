$(document).ready(function() {
    'use strict';
    
    // Theme Management
    const themeToggle = $('#theme-toggle');
    const htmlElement = $('html');
    const themeIcon = themeToggle.find('i');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTheme(savedTheme);
    
    // Theme toggle handler
    themeToggle.on('click', function() {
        const currentTheme = htmlElement.attr('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        htmlElement.attr('data-bs-theme', theme);
        
        if (theme === 'dark') {
            themeIcon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            themeIcon.removeClass('fa-sun').addClass('fa-moon');
        }
    }
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            e.preventDefault();
            
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });
    
    // Active navigation highlighting
    $(window).on('scroll', function() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('section[id], div[id]').each(function() {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionHeight = section.outerHeight();
            const sectionId = section.attr('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${sectionId}"]`).addClass('active');
            }
        });
    });
    
    // Copy to clipboard functionality
    $('.copy-btn').on('click', function() {
        const textToCopy = $(this).data('copy');
        
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(function() {
                showCopyToast();
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
                fallbackCopyTextToClipboard(textToCopy);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(textToCopy);
        }
    });
    
    function fallbackCopyTextToClipboard(text) {
        const textArea = $('<textarea>');
        textArea.val(text);
        textArea.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '2em',
            height: '2em',
            padding: 0,
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent'
        });
        
        $('body').append(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyToast();
            } else {
                console.error('Fallback: Copying text command was unsuccessful');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        textArea.remove();
    }
    
    function showCopyToast() {
        const toast = new bootstrap.Toast(document.getElementById('copyToast'));
        toast.show();
    }
    
    // Navbar scroll effect
    $(window).on('scroll', function() {
        const navbar = $('.navbar');
        
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    
    // Add scrolled class styles
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .navbar.scrolled {
                background-color: rgba(0, 0, 0, 0.95) !important;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            [data-bs-theme="light"] .navbar.scrolled {
                background-color: rgba(0, 0, 0, 0.95) !important;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
        `)
        .appendTo('head');
    
    // Lazy loading for badges (GitHub shields) - removed opacity animation
    const badges = $('.badges-row img');
    
    badges.each(function() {
        const img = $(this);
        
        img.on('load', function() {
            $(this).addClass('loaded');
        });
        
        img.on('error', function() {
            console.log('Badge failed to load:', $(this).attr('src'));
            // Don't hide failed badges, let them show as broken images temporarily
        });
    });
    
    // Force reload badges if they haven't loaded after 3 seconds
    setTimeout(function() {
        badges.each(function() {
            if (!$(this).hasClass('loaded') && !$(this).prop('complete')) {
                const src = $(this).attr('src');
                $(this).attr('src', src + '&t=' + Date.now());
            }
        });
    }, 3000);
    
    // Initialize tooltips if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Keyboard navigation improvements
    $(document).on('keydown', function(e) {
        // ESC key closes any open modals or dropdowns
        if (e.key === 'Escape') {
            $('.modal').modal('hide');
            $('.dropdown-menu').removeClass('show');
            $('.navbar-collapse').removeClass('show');
        }
    });
    
    // Add focus management for mobile menu
    $('.navbar-toggler').on('click', function() {
        const expanded = $(this).attr('aria-expanded') === 'true';
        
        if (!expanded) {
            setTimeout(function() {
                $('.navbar-nav .nav-link').first().focus();
            }, 300);
        }
    });
    
    // Performance: Debounce scroll events
    let scrollTimer = null;
    const originalScrollHandler = $(window).data('events')?.scroll;
    
    $(window).off('scroll').on('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(function() {
            // Execute all scroll handlers
            $(window).trigger('scroll.debounced');
        }, 10);
    });
    
    // Move existing scroll handlers to debounced event
    $(window).on('scroll.debounced', function() {
        // Active nav highlighting
        const scrollPos = $(window).scrollTop() + 100;
        
        $('section[id], div[id]').each(function() {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionHeight = section.outerHeight();
            const sectionId = section.attr('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${sectionId}"]`).addClass('active');
            }
        });
        
        // Navbar scroll effect
        const navbar = $('.navbar');
        
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    
    // Analytics placeholder (Plausible)
    if (typeof plausible !== 'undefined') {
        // Track page view
        plausible('pageview');
        
        // Track button clicks
        $('.btn[href*="github.com"]').on('click', function() {
            plausible('GitHub Link Click', {
                props: {
                    button: $(this).text().trim(),
                    section: $(this).closest('section').attr('id') || 'header'
                }
            });
        });
        
        // Track copy actions
        $('.copy-btn').on('click', function() {
            plausible('Code Copy', {
                props: {
                    section: $(this).closest('section').attr('id') || 'unknown'
                }
            });
        });
    }
    
    console.log('🚀 PHP Ledger website initialized successfully!');
});

// Add easing function for smooth scrolling
$.easing.easeInOutCubic = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};