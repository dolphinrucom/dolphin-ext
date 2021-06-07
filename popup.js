let proxies = [];

// ВЫВОД ТОКЕНА
chrome.tabs.query({ active: true, currentWindow: true }, (currentTab) => {
  if (!currentTab[0].url.startsWith('chrome://') && !currentTab[0].url.startsWith('about:')) {
    chrome.tabs.executeScript(null, {
      code: "Array.from(document.getElementsByTagName('script')).map(h => h.innerHTML)",
    }, (results) => {
      let hasToken = false;
      let regex;
      let match;
      let token;
      if (results) {
        for (i = 0; i < results[0].length; i++) {
          if (results[0][i].search('window.__accessToken') > 1) {
            regex = /"EA[A-Za-z0-9]{20,}/gm;
            match = results[0][i].match(regex);
            token = match[0].substr(1);
            $('p.accessToken').text(token);
            hasToken = true;
          }
        }
        if (!hasToken) {
          $('p.accessToken').text(locale === 'ru'
            ? 'Токен фб не найден' : locale === 'cn'
              ? 'Facebook的访问令牌未找到' : 'Facebook token not found');
        }
      }
    });
    // USERAGENT
    chrome.tabs.executeScript(null, {
      code: 'window.navigator.userAgent',
    }, (userAgent) => {
      $('input.userAgent').val(userAgent[0]);
    });
  } else {
    $('p.accessToken').text(locale === 'ru'
      ? 'Токен фб не найден' : locale === 'cn'
        ? 'Facebook的访问令牌未找到' : 'Facebook token not found');
  }
});

// ТОКЕН ДЕЛЬФИНА
if (localStorage.getItem('dolphin-chrome-extension-dolphinToken')) {
  $('input.dolphinToken').val(localStorage.getItem('dolphin-chrome-extension-dolphinToken'));
}
$('input.dolphinToken').on('change paste keyup', () => {
  localStorage.setItem('dolphin-chrome-extension-dolphinToken', $('input.dolphinToken').val());
  connectToDolphin();
});

async function connectToDolphin() {
  // ПРОВЕРКА ТОКЕНА ДЕЛЬФИН
  let dolphinTokenExists = false;
  if (localStorage.getItem('dolphin-chrome-extension-dolphinToken')) {
    const dolphinToken = localStorage.getItem('dolphin-chrome-extension-dolphinToken');
    let dolphinAuthorization = false;
    try {
      dolphinAuthorization = window.atob(dolphinToken).split('::');
    } catch (error) {
      console.log(error);
    }
    if (dolphinAuthorization && dolphinAuthorization.length === 2) {
      dolphinTokenExists = true;
      // AXIOS
      try {
        dolphinAuthorization = window.atob(dolphinToken).split('::');
      } catch (error) {
        console.log(error);
      }
      api = axios.create({
        baseURL: dolphinAuthorization[0],
        headers: {
          Authorization: dolphinAuthorization[1],
        },
      });
    } else {
      dolphinTokenExists = false;
    }
  } else {
    try {
      const token = await axios.get('http://localhost:3001/v1.0/settings/dolphin_token').then((res) => res.data.result);
      if (token) {
        localStorage.setItem('dolphin-chrome-extension-dolphinToken', token);
        connectToDolphin();
        dolphinTokenExists = true;
      } else {
        dolphinTokenExists = false;
      }
    } catch (error) {
      console.log(error);
      dolphinTokenExists = false;
    }
  }
  if (dolphinTokenExists) {
    var profile = await api('/profile').catch((error) => console.log(error));
  }
  if (typeof profile !== 'undefined' && profile.data.success) {
    $('.addAccountCard').show();
    $('.connectionToDolphinSuccess')
      .show()
      .html(`${locale === 'ru'
        ? 'Cвязь с Dolphin установлена. Пользователь:' : locale === 'cn'
          ? 'Dolphin服务器连接建立成功。用户：' : 'Dolphin connection established. User:'} <b>${profile.data.data.login}</b>`);
    $('.connectionToDolphinUnsuccess').hide();

    // НАЗНАЧЕНИЕ ПРОКСИ
    await (async function () {
      const response = await api('/proxy');
      if (typeof response.data.data !== 'undefined') {
        proxies = proxies.concat(response.data.data);
        for (const proxy of response.data.data) {
          $('select.proxy-select').append(`<option value="${proxy.id}">${proxy.name}</option>`);
        }
      }
    }());

    // НАЗНАЧЕНИЕ ТЕГОВ
    let tags = [];
    await (async function () {
      const response = await api('/tags');
      if (typeof response.data.data !== 'undefined') {
        tags = tags.concat(response.data.data);
        for (const tag of response.data.data) {
          $('select.tags-select').append(`<option value="${tag}">${tag}</option>`);
        }
      }
    }());
  } else {
    $('.addAccountCard').hide();
    $('.connectionToDolphinSuccess').hide();
    $('.connectionToDolphinUnsuccess').show();
  }
}

$(document).ready(async () => {
  // СЕЛЕКТ
  $('.proxy-select').select2();
  $('.tags-select').select2({
    tags: true,
    placeholder: locale === 'ru' ? 'Выберите теги' : locale === 'cn' ? '选标签' : 'Choose tags',
    closeOnSelect: false,
    height: 25,
  });

  $('.addAccountCard').hide();
  $('.connectionToDolphinSuccess').hide();
  $('.connectionToDolphinUnsuccess').hide();
  $('.addAccountSuccess').hide();
  $('.addAccountUnsuccess').hide();

  // ПОДКЛЮЧЕНИЕ К ДЕЛЬФИНУ
  connectToDolphin();

  // ДОБАВИТЬ АККАУНТ
  $('button.addAccount').on('click', async () => {
    if ($('p.accessToken').text() !== 'Токен фб не найден' && $('p.accessToken').text() !== 'Facebook token not found' && $('input.accountName').val() !== '' && $('input.userAgent').val() !== '') {
      $('.addAccountSuccess').show();
      $('.addAccountUnsuccess').hide();
      const data = {
        access_token: $('p.accessToken').text(),
        name: $('input.accountName').val(),
        proxy: $('select.proxy-select').val() === '' ? '' : proxies.find((proxy) => proxy.id === parseInt($('select.proxy-select').val())),
        tags: $('select.tags-select').val(),
        useragent: $('input.userAgent').val(),
        // newProxy:null
      };
      $('button.addAccount').prop('disabled', true);
      await api.post('/accounts/add', data).catch((error) => {
        console.log(error);
      });
      $('button.addAccount').prop('disabled', false);
    } else {
      $('.addAccountSuccess').hide();
      $('.addAccountUnsuccess').show();
    }
  });
});
// Дельфин саппортов
// aHR0cDovLzE5My4xNjguMy4xMDcvbmV3OjoxLWFkOTMzNTMwNjhhOWYwZTY2YzAyMWZlMjJkZTNlYmI1
