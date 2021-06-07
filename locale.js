$( ".localeSelect" ).change(async (e) => {
    await localStorage.setItem('dolphinExtensionLocale', e.currentTarget.value)
    await location.reload();
});

const locale = localStorage.getItem('dolphinExtensionLocale') ?
    localStorage.getItem('dolphinExtensionLocale') : navigator.language.startsWith('ru') ?
    'ru' : navigator.language.startsWith('zh') ? 
    'cn' : 'en'

if (locale === 'ru') {
    $( ".flagImage" ).attr("src", './assets/ru.png');
    $( ".localeSelect" ).val(locale);
    $( ".card-header.fbToken" ).text('Токен ФБ');
    $( "div.card-header.addAccount" ).text('Добавление аккаунта');
    $( "input.accountName" ).attr("placeholder", 'Название аккаунта');
    $( "#proxySelectId option.noProxyOption" ).text('Без прокси');
    $( "button.addAccount" ).text('добавить');
    $( ".alert.addAccountSuccess" ).text('Аккаунт добавлен.');
    $( ".alert.addAccountUnsuccess" ).text('Заполните поля.');
    $( ".card-header.dolphinConnection" ).text('Соединение с Dolphin');
    $( "input#dolphinTokenId" ).attr("placeholder", 'Токен Dolphin');
    $( ".alert.connectionToDolphinSuccess" ).text('Cвязь с Dolphin установлена.');
    $( ".alert.connectionToDolphinUnsuccess" ).text('Не удалось соединиться с Dolphin.');
} else if (locale === 'cn') {
    $( ".flagImage" ).attr("src", './assets/cn.png');
    $( ".localeSelect" ).val(locale);
    $( ".card-header.fbToken" ).text('访问令牌 (fb acces token)');
    $( "div.card-header.addAccount" ).text('添加账户');
    $( "input.accountName" ).attr("placeholder", '账户名称');
    $( "#proxySelectId option.noProxyOption" ).text('选代理');
    $( "button.addAccount" ).text('添加');
    $( ".alert.addAccountSuccess" ).text('账户成功添加.');
    $( ".alert.addAccountUnsuccess" ).text('Заполните поля.');
    $( ".card-header.dolphinConnection" ).text('Dolphin服务器连接');
    $( "input#dolphinTokenId" ).attr("placeholder", 'Dolphin的访问令牌');
    $( ".alert.connectionToDolphinSuccess" ).text('Dolphin服务器连接建立成功');
    $( ".alert.connectionToDolphinUnsuccess" ).text('Dolphin服务器连接未建立');
} else {
    $( ".flagImage" ).attr("src", './assets/gb.png');
    $( ".localeSelect" ).val(locale);
    $( ".card-header.fbToken" ).text('Facebook Token');
    $( "div.card-header.addAccount" ).text('Add account');
    $( "input.accountName" ).attr("placeholder", 'Account name');
    $( "#proxySelectId option.noProxyOption" ).text('No proxy');
    $( "button.addAccount" ).text('add');
    $( ".alert.addAccountSuccess" ).text('Account successfully added.');
    $( ".alert.addAccountUnsuccess" ).text('Fill in the fields correctly.');
    $( ".card-header.dolphinConnection" ).text('Dolphin connection');
    $( "input#dolphinTokenId" ).attr("placeholder", 'Dolphin token');
    $( ".alert.connectionToDolphinSuccess" ).text('Dolphin connection established.');
    $( ".alert.connectionToDolphinUnsuccess" ).text('Dolphin connection not established.');
}
