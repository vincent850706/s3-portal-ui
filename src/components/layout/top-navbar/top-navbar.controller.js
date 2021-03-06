export default class TopNavbarController {
  /** @ngInject */
  constructor($scope, $translate, $auth, $state, $toast, $mdDialog, $transfer, AuthService) {
    Object.assign(this, {
      $scope, $translate, $auth, $state, $toast, $mdDialog, $transfer, AuthService,
    });

    this.languages = [
      { key: 'EN', name: 'English' },
      { key: 'TW', name: '繁體中文' },
      { key: 'CN', name: '简体中文' },
    ];

    this.currentLanguage = $translate.use();
  }

  /**
   * Change the language of UI.
   *
   * @param  {string} key
   * @return {void}
   */
  changeLanguage(key) {
    this.$translate.use(key);
    this.currentLanguage = key;
  }

  /**
   * Do the sign out flow when user click the sign out button.
   *
   * @param  {Object} $event
   * @return {void}
   */
  signOut($event) {
    if (this.$transfer.isProcessing()) {
      this.showConfirmMessage($event);
    } else {
      this.executedSignOut();
    }
  }

  goManager() {
    this.$state.go('manager.list');
  }

  /**
   * Show a confirm message for sign out.
   *
   * @param  {Object} $event
   * @return {Promise}
   */
  showConfirmMessage($event) {
    const sources = [
      'SETTINGS.SIGN_OUT_CONFIRM_TITLE',
      'SETTINGS.SIGN_OUT_CONFIRM_MESSAGE',
      'SETTINGS.SIGN_OUT',
      'SETTINGS.LEAVE',
      'SETTINGS.STAY',
    ];

    this.$translate(sources)
      .then(translations => {
        const confirm = this.$mdDialog.confirm()
          .title(translations[sources[0]])
          .textContent(translations[sources[1]])
          .ariaLabel(translations[sources[2]])
          .targetEvent($event)
          .ok(translations[sources[3]])
          .cancel(translations[sources[4]]);

        this.$mdDialog.show(confirm).then(this.executedSignOut);
      });
  }

  /**
   * Executed sign out when user confirm the message.
   *
   * @return {Promise} [description]
   */
  executedSignOut = () => this.AuthService.signOut()
    .then(() => this.$translate('TOAST.SIGN_OUT_SUCCESS'))
    .then(signOutSuccess => {
      this.$transfer.abort()
      this.$auth.logout();
      this.$state.go('auth.signin');
      this.$toast.show(signOutSuccess);
    })
    .catch(() => this.$translate('TOAST.SIGN_OUT_FAILURE')
      .then(signOutFailure => this.$toast.show(signOutFailure))
    );
}
