import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageMainTemplate';

function HomePage() {
  const dataFiles = [
    { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
    { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
    { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
    { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
    { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
    { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
    { file: '070.json', key: 'narMobileAds', provider: 'Nar Mobile', prefix: '070' },
    { file: '077.json', key: 'narMobileAds', provider: 'Nar Mobile', prefix: '077' },
  ];

  return (
    <>
      <NumbersPageTemplate
        pageTitle="Bütün Nömrələr"
        dataFiles={dataFiles}
        showProviderFilter={true}
      />
      <PhonePageTemplate
        pageTitle="Bütün Nömrələr"
        dataFiles={dataFiles}
        showProviderFilter={true}
      />
    </>
  );
}

export default HomePage;
