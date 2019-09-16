jQuery(function($) {

	var body = $('body');
	var html = $('html');
	var viewport = $(window);

	/* ==========================================================================
	   Newsletter popup
		 ========================================================================== */

	var newsletterOpened = false;
	var hasSpentEnoughTime = false;
	var ONE_DAY = 24 * 60 * 60 * 1000;
	setTimeout(function() {
		hasSpentEnoughTime = true;
	}, window.location.host.indexOf('localhost') === 0 ? 0 :20000);

	$(document).scroll(function() {
		var y = $(this).scrollTop();
		if (!newsletterOpened && hasSpentEnoughTime && y > document.body.clientHeight * 0.3) {
			newsletterOpened = true;

			var hasAlreadySubscribed = localStorage.getItem('newsletter-subscribed');
			if (hasAlreadySubscribed) return;

			var lastClosed = localStorage.getItem('newsletter-popup-closed');
			var lastClosedBeforeOneDay = !lastClosed || Date.now() - lastClosed > ONE_DAY;

			if (lastClosedBeforeOneDay) {
				$('.newsletter-popup').fadeIn();
			}
		}
	});

	window._closeNewsletterPopup = function() {
		localStorage.setItem('newsletter-popup-closed', Date.now());
		$('.newsletter-popup').fadeOut();
	}

	if (window.MutationObserver) {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (!mutation.addedNodes) return;

				for (var i = 0; i < mutation.addedNodes.length; i++) {
					var node = mutation.addedNodes[i];
					var button = node.querySelector && node.querySelector('.ml-form-embedSubmit button.primary');
					if (button) {
						button.addEventListener('click', function() {
							localStorage.setItem('newsletter-subscribed', Date.now());
						});
					}
				}
			});
		})

		observer.observe(document.body, {
				childList: true
			, subtree: true
			, attributes: false
			, characterData: false
		});
	}

	/* ==========================================================================
	   Menu
	   ========================================================================== */

	function menu() {
		html.toggleClass('menu-active');
	};

	$('#menu').on({
		'click': function() {
			menu();
		}
	});

	$('.menu-button').on({
		'click': function() {
			menu();
		}
	});

	$('.hidden-close').on({
		'click': function() {
			menu();
		}
	});

	/* ==========================================================================
	   Parallax cover
	   ========================================================================== */

	var cover = $('.cover');
	var coverPosition = 0;

	function prlx() {
		if(cover.length >= 1) {
			var windowPosition = viewport.scrollTop();
			(windowPosition > 0) ? coverPosition = Math.floor(windowPosition * 0.25) : coverPosition = 0;
			cover.css({
				'-webkit-transform' : 'translate3d(0, ' + coverPosition + 'px, 0)',
				'transform' : 'translate3d(0, ' + coverPosition + 'px, 0)'
			});
			(viewport.scrollTop() < cover.height()) ? html.addClass('cover-active') : html.removeClass('cover-active');
		}
	}
	prlx();

	viewport.on({
		'scroll': function() {
			prlx();
		},
		'resize': function() {
			prlx();
		},
		'orientationchange': function() {
			prlx();
		}
	});

	/* ==========================================================================
	   Reading Progress
	   ========================================================================== */

	var post = $('.post-content');

	function readingProgress() {
		if(post.length >= 1) {
			var postBottom = post.offset().top + post.height();
			var windowBottom = viewport.scrollTop() + viewport.height();
			var progress = 100 - (((postBottom - windowBottom) / (postBottom - viewport.height())) * 100);
			$('.progress-bar').css('width', progress + '%');
			(progress > 100) ? $('.progress-container').addClass('ready') : $('.progress-container').removeClass('ready');
		}
	}
	readingProgress();

	viewport.on({
		'scroll': function() {
			readingProgress();
		},
		'resize': function() {
			readingProgress();
		},
		'orientationchange': function() {
			readingProgress();
		}
	});

	/* ==========================================================================
	   Gallery
	   ========================================================================== */

	function gallery() {
		var images = document.querySelectorAll('.kg-gallery-image img');
		images.forEach(function (image) {
			var container = image.closest('.kg-gallery-image');
			var width = image.attributes.width.value;
			var height = image.attributes.height.value;
			var ratio = width / height;
			container.style.flex = ratio + ' 1 0%';
		});
	}
	gallery();

	/* ==========================================================================
	   Style code blocks with highlight and numbered lines
	   ========================================================================== */

	function codestyling() {
		$('pre code').each(function(i, e) {
			hljs.highlightBlock(e);

			if(!$(this).hasClass('language-text')) {
				var code = $(this);
				var lines = code.html().split(/\n/).length;
				var numbers = [];
				for (i = 1; i < lines; i++) {
					numbers += '<span class="line">' + i + '</span>';
				}
				code.parent().append('<div class="lines">' + numbers + '</div>');
			}
		});
	}
	codestyling();

	/* ==========================================================================
	   Responsive Videos with Fitvids
	   ========================================================================== */

	function video() {
		$('#wrapper').fitVids();
	}
	video();

	/* ==========================================================================
	   Initialize and load Disqus
	   ========================================================================== */

	if (typeof disqus === 'undefined') {
		$('.post-comments').css({
			'display' : 'none'
		});
	} else {
		$('#show-disqus').on('click', function() {
			$.ajax({
				type: "GET",
				url: "//" + disqus + ".disqus.com/embed.js",
				dataType: "script",
				cache: true
			});
			$(this).parent().addClass('activated');
		});
	}
});
