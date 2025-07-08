# 🎯 Azercell Sayfa Prefix Filtreleme - Test Senaryoları

## ✅ Yapılan Düzeltmeler

### 🔧 Ana Sorun Çözüldü:
- **Önceki Problem**: Kullanıcı arama yapmaya başladığında prefix seçimi temizleniyordu
- **Yeni Çözüm**: Prefix seçimi SABIT kalır, arama prefix içinde yapılır

### 🎯 Filtreleme Öncelik Sırası:
1. **Prefix Filtresi** (EN ÖNEMLİ) → Sadece seçilen prefix'teki numaralar
2. **Arama Filtresi** (İKİNCİL) → Prefix içinde arama

## 🧪 Test Senaryoları

### Test 1: Prefix Seçimi (Temel)
1. **Adım**: Azercell sayfasına git → http://localhost:3001/numbers/azercell
2. **Adım**: "Prefiks seçin" dropdown'ından **010** seç
3. **Beklenen**: Sadece 010-xxx-xx-xx formatında numaralar görünsün
4. **Beklenen**: Mesaj: "010 prefiksi: X nömrə"
5. **Beklenen**: 050 ve 051 numaraları TAMAMEN GİZLİ

### Test 2: Prefix + Arama Kombinasyonu
1. **Adım**: **010** prefix'ini seç
2. **Adım**: Arama kutusuna **406** yaz
3. **Beklenen**: Sadece 010 ile başlayan VE 406 içeren numaralar (örn: 010-406-06-06)
4. **Beklenen**: Mesaj: "010 prefiksində '406' üçün X nəticə tapıldı"
5. **Beklenen**: 050-406-xx-xx gibi numaralar ASLA GÖRÜNMEZ

### Test 3: Farklı Prefix Seçimi
1. **Adım**: **050** prefix'ini seç
2. **Beklenen**: Sadece 050-xxx-xx-xx numaralar görünsün
3. **Beklenen**: 010 ve 051 numaraları GİZLİ
4. **Adım**: Arama kutusuna **999** yaz
5. **Beklenen**: Sadece 050 ile başlayan VE 999 içeren numaralar

### Test 4: Prefix Değiştirme
1. **Adım**: **010** seç → 010 numaraları görünsün
2. **Adım**: Arama kutusuna **777** yaz
3. **Adım**: Prefix'i **050** olarak değiştir
4. **Beklenen**: Artık sadece 050 ile başlayan VE 777 içeren numaralar
5. **Beklenen**: 010-777-xx-xx numaraları KAYBOLUR

## 🔍 Teknik Detaylar

### Filtreleme Kodu:
```javascript
// ✅ ÖNCE prefix kontrolü (En önemli)
if (selectedPrefix) {
  const cleanPrefix = selectedPrefix.replace(/[^0-9]/g, '');
  if (!phoneDigits.startsWith(cleanPrefix)) return false;
}

// ✅ SONRA arama kontrolü (Prefix içinde)
if (searchTerm.trim()) {
  // Arama sadece prefix'e uyan numaralar arasında yapılır
}
```

### Mesaj Sistemi:
```javascript
{searchTerm.trim() && selectedPrefix ? (
  // Prefix + Arama: "010 prefiksində '406' üçün 1 nəticə"
) : searchTerm.trim() ? (
  // Sadece Arama: "'777' üçün 5 nəticə"  
) : selectedPrefix ? (
  // Sadece Prefix: "010 prefiksi: 15 nömrə"
) : (
  // Hiçbiri: "Cəmi 45 nömrə"
)}
```

### Placeholder Sistemi:
- **Prefix seçili değil**: "Əvvəlcə prefix seçin, sonra axtar"
- **Prefix seçili**: "010 prefiksi daxilində axtar (266, 777...)"

## ✅ Garanti Edilen Davranışlar:

1. **Prefix Seçilince**: Sadece o prefix'teki numaralar görünür
2. **Arama Başlayınca**: Prefix seçimi ASLA temizlenmez
3. **Prefix + Arama**: Hem prefix hem arama şartlarını karşılayan numaralar
4. **Prefix Değişince**: Yeni prefix'e uygun numaralar, arama devam eder
5. **Öncelik**: Prefix > Arama (prefix seçimi her zaman baskın)

## 🎯 Sonuç:

Artık Azercell sayfasında prefix seçimi **MUTLAK** öncelik taşıyor. Kullanıcı hangi prefix'i seçerse, sistem SADECE o prefix'teki numaraları gösterir ve arama da bu prefix içinde yapılır.

**Test URL**: http://localhost:3001/numbers/azercell
