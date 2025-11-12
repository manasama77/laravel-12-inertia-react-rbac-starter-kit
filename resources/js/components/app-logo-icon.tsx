import AppLogo from '@images/logo-passnet-color-1.png';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={AppLogo} alt="App Logo" {...props} />;
}
