declare module 'react-google-recaptcha';

// Adicione estas linhas para o CSS:
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}