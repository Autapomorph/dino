import getTokenParam from './getTokenParam';

const isTelegramMode = () => Boolean(window.TelegramGameProxy && getTokenParam());

export default isTelegramMode;
