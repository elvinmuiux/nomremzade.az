import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageTemplate';

function HomePage() {
  const dataFiles = [
    { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
    { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
    { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
    { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
    { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
    { file: '070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
    { file: '077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
    { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
  ];

  return (
    <>
      {/* Desktop Template */}
      <NumbersPageTemplate
        pageTitle="Əsas səhifə"
        dataFiles={dataFiles}
        showProviderFilter={true}
      />
      
      {/* Mobile Template */}
      <PhonePageTemplate
        title="Bütün nömrələr"
        dataFiles={dataFiles}
        showProviderFilter={true}
      />
    </>
  );
}

export default HomePage;
