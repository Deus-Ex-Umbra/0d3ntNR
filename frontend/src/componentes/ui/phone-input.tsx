import { Input } from '@/componentes/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/componentes/ui/select';
import { Label } from '@/componentes/ui/label';

interface CodigoPais {
  codigo: string;
  nombre: string;
  bandera: string;
}

const codigos_paises: CodigoPais[] = [
  { codigo: '+93', nombre: 'Afganistán', bandera: '🇦🇫' },
  { codigo: '+355', nombre: 'Albania', bandera: '🇦🇱' },
  { codigo: '+49', nombre: 'Alemania', bandera: '🇩🇪' },
  { codigo: '+376', nombre: 'Andorra', bandera: '🇦🇩' },
  { codigo: '+244', nombre: 'Angola', bandera: '🇦🇴' },
  { codigo: '+1264', nombre: 'Anguila', bandera: '🇦🇮' },
  { codigo: '+672', nombre: 'Antártida', bandera: '🇦🇶' },
  { codigo: '+1268', nombre: 'Antigua y Barbuda', bandera: '🇦🇬' },
  { codigo: '+966', nombre: 'Arabia Saudita', bandera: '🇸🇦' },
  { codigo: '+213', nombre: 'Argelia', bandera: '🇩🇿' },
  { codigo: '+54', nombre: 'Argentina', bandera: '🇦🇷' },
  { codigo: '+374', nombre: 'Armenia', bandera: '🇦🇲' },
  { codigo: '+297', nombre: 'Aruba', bandera: '🇦🇼' },
  { codigo: '+61', nombre: 'Australia', bandera: '🇦🇺' },
  { codigo: '+43', nombre: 'Austria', bandera: '🇦🇹' },
  { codigo: '+994', nombre: 'Azerbaiyán', bandera: '🇦🇿' },
  { codigo: '+1242', nombre: 'Bahamas', bandera: '🇧🇸' },
  { codigo: '+973', nombre: 'Baréin', bandera: '🇧🇭' },
  { codigo: '+880', nombre: 'Bangladés', bandera: '🇧🇩' },
  { codigo: '+1246', nombre: 'Barbados', bandera: '🇧🇧' },
  { codigo: '+32', nombre: 'Bélgica', bandera: '🇧🇪' },
  { codigo: '+501', nombre: 'Belice', bandera: '🇧🇿' },
  { codigo: '+229', nombre: 'Benín', bandera: '🇧🇯' },
  { codigo: '+1441', nombre: 'Bermudas', bandera: '🇧🇲' },
  { codigo: '+375', nombre: 'Bielorrusia', bandera: '🇧🇾' },
  { codigo: '+591', nombre: 'Bolivia', bandera: '🇧🇴' },
  { codigo: '+387', nombre: 'Bosnia y Herzegovina', bandera: '🇧🇦' },
  { codigo: '+267', nombre: 'Botsuana', bandera: '🇧🇼' },
  { codigo: '+55', nombre: 'Brasil', bandera: '🇧🇷' },
  { codigo: '+673', nombre: 'Brunéi', bandera: '🇧🇳' },
  { codigo: '+359', nombre: 'Bulgaria', bandera: '🇧🇬' },
  { codigo: '+226', nombre: 'Burkina Faso', bandera: '🇧🇫' },
  { codigo: '+257', nombre: 'Burundi', bandera: '🇧🇮' },
  { codigo: '+975', nombre: 'Bután', bandera: '🇧🇹' },
  { codigo: '+238', nombre: 'Cabo Verde', bandera: '🇨🇻' },
  { codigo: '+855', nombre: 'Camboya', bandera: '🇰🇭' },
  { codigo: '+237', nombre: 'Camerún', bandera: '🇨🇲' },
  { codigo: '+235', nombre: 'Chad', bandera: '🇹🇩' },
  { codigo: '+56', nombre: 'Chile', bandera: '🇨🇱' },
  { codigo: '+86', nombre: 'China', bandera: '🇨🇳' },
  { codigo: '+357', nombre: 'Chipre', bandera: '🇨🇾' },
  { codigo: '+57', nombre: 'Colombia', bandera: '🇨🇴' },
  { codigo: '+269', nombre: 'Comoras', bandera: '🇰🇲' },
  { codigo: '+850', nombre: 'Corea del Norte', bandera: '🇰🇵' },
  { codigo: '+82', nombre: 'Corea del Sur', bandera: '🇰🇷' },
  { codigo: '+225', nombre: 'Costa de Marfil', bandera: '🇨🇮' },
  { codigo: '+506', nombre: 'Costa Rica', bandera: '🇨🇷' },
  { codigo: '+385', nombre: 'Croacia', bandera: '🇭🇷' },
  { codigo: '+53', nombre: 'Cuba', bandera: '🇨🇺' },
  { codigo: '+599', nombre: 'Curazao', bandera: '🇨🇼' },
  { codigo: '+45', nombre: 'Dinamarca', bandera: '🇩🇰' },
  { codigo: '+1767', nombre: 'Dominica', bandera: '🇩🇲' },
  { codigo: '+593', nombre: 'Ecuador', bandera: '🇪🇨' },
  { codigo: '+20', nombre: 'Egipto', bandera: '🇪🇬' },
  { codigo: '+503', nombre: 'El Salvador', bandera: '🇸🇻' },
  { codigo: '+971', nombre: 'Emiratos Árabes Unidos', bandera: '🇦🇪' },
  { codigo: '+291', nombre: 'Eritrea', bandera: '🇪🇷' },
  { codigo: '+421', nombre: 'Eslovaquia', bandera: '🇸🇰' },
  { codigo: '+386', nombre: 'Eslovenia', bandera: '🇸🇮' },
  { codigo: '+34', nombre: 'España', bandera: '🇪🇸' },
  { codigo: '+1', nombre: 'EE.UU./Canadá y otros', bandera: '🇺🇸' }, // Agrupado
  { codigo: '+372', nombre: 'Estonia', bandera: '🇪🇪' },
  { codigo: '+268', nombre: 'Esuatini', bandera: '🇸🇿' },
  { codigo: '+251', nombre: 'Etiopía', bandera: '🇪🇹' },
  { codigo: '+63', nombre: 'Filipinas', bandera: '🇵🇭' },
  { codigo: '+358', nombre: 'Finlandia', bandera: '🇫🇮' },
  { codigo: '+679', nombre: 'Fiyi', bandera: '🇫🇯' },
  { codigo: '+33', nombre: 'Francia', bandera: '🇫🇷' },
  { codigo: '+241', nombre: 'Gabón', bandera: '🇬🇦' },
  { codigo: '+220', nombre: 'Gambia', bandera: '🇬🇲' },
  { codigo: '+995', nombre: 'Georgia', bandera: '🇬🇪' },
  { codigo: '+233', nombre: 'Ghana', bandera: '🇬🇭' },
  { codigo: '+350', nombre: 'Gibraltar', bandera: '🇬🇮' },
  { codigo: '+1473', nombre: 'Granada', bandera: '🇬🇩' },
  { codigo: '+30', nombre: 'Grecia', bandera: '🇬🇷' },
  { codigo: '+299', nombre: 'Groenlandia', bandera: '🇬🇱' },
  { codigo: '+590', nombre: 'Guadalupe', bandera: '🇬🇵' },
  { codigo: '+1671', nombre: 'Guam', bandera: '🇬🇺' },
  { codigo: '+502', nombre: 'Guatemala', bandera: '🇬🇹' },
  { codigo: '+594', nombre: 'Guayana Francesa', bandera: '🇬🇫' },
  { codigo: '+44', nombre: 'Guernsey/R. Unido', bandera: '🇬🇬' },
  { codigo: '+224', nombre: 'Guinea', bandera: '🇬🇳' },
  { codigo: '+240', nombre: 'Guinea Ecuatorial', bandera: '🇬🇶' },
  { codigo: '+245', nombre: 'Guinea-Bisáu', bandera: '🇬🇼' },
  { codigo: '+592', nombre: 'Guyana', bandera: '🇬🇾' },
  { codigo: '+509', nombre: 'Haití', bandera: '🇭🇹' },
  { codigo: '+504', nombre: 'Honduras', bandera: '🇭🇳' },
  { codigo: '+852', nombre: 'Hong Kong', bandera: '🇭🇰' },
  { codigo: '+36', nombre: 'Hungría', bandera: '🇭🇺' },
  { codigo: '+91', nombre: 'India', bandera: '🇮🇳' },
  { codigo: '+62', nombre: 'Indonesia', bandera: '🇮🇩' },
  { codigo: '+964', nombre: 'Irak', bandera: '🇮🇶' },
  { codigo: '+98', nombre: 'Irán', bandera: '🇮🇷' },
  { codigo: '+353', nombre: 'Irlanda', bandera: '🇮🇪' },
  { codigo: '+246', nombre: 'Isla B. O. Índico', bandera: '🇮🇴' },
  { codigo: '+61891', nombre: 'Isla de Cocos', bandera: '🇨🇨' },
  { codigo: '+441624', nombre: 'Isla de Man', bandera: '🇮🇲' },
  { codigo: '+61891', nombre: 'Isla de Navidad', bandera: '🇨🇽' },
  { codigo: '+47', nombre: 'Isla Bouvet/Noruega', bandera: '🇧🇻' }, 
  { codigo: '+500', nombre: 'Islas F. (Malvinas)', bandera: '🇫🇰' },
  { codigo: '+298', nombre: 'Islas Feroe', bandera: '🇫🇴' },
  { codigo: '+672', nombre: 'Islas Heard y McDonald', bandera: '🇭🇲' },
  { codigo: '+1345', nombre: 'Islas Caimán', bandera: '🇰🇾' },
  { codigo: '+682', nombre: 'Islas Cook', bandera: '🇨🇰' },
  { codigo: '+670', nombre: 'Islas M. del Norte', bandera: '🇲🇵' },
  { codigo: '+692', nombre: 'Islas Marshall', bandera: '🇲🇭' },
  { codigo: '+677', nombre: 'Islas Salomón', bandera: '🇸🇧' },
  { codigo: '+1649', nombre: 'Islas Turcas y Caicos', bandera: '🇹🇨' },
  { codigo: '+1284', nombre: 'Islas Vírgenes (UK)', bandera: '🇻🇬' },
  { codigo: '+1340', nombre: 'Islas Vírgenes (US)', bandera: '🇻🇮' },
  { codigo: '+354', nombre: 'Islandia', bandera: '🇮🇸' },
  { codigo: '+972', nombre: 'Israel', bandera: '🇮🇱' },
  { codigo: '+39', nombre: 'Italia', bandera: '🇮🇹' },
  { codigo: '+1876', nombre: 'Jamaica', bandera: '🇯🇲' },
  { codigo: '+81', nombre: 'Japón', bandera: '🇯🇵' },
  { codigo: '+441534', nombre: 'Jersey', bandera: '🇯🇪' },
  { codigo: '+962', nombre: 'Jordania', bandera: '🇯🇴' },
  { codigo: '+7', nombre: 'Kazajistán/Rusia', bandera: '🇰🇿' }, 
  { codigo: '+254', nombre: 'Kenia', bandera: '🇰🇪' },
  { codigo: '+996', nombre: 'Kirguistán', bandera: '🇰🇬' },
  { codigo: '+686', nombre: 'Kiribati', bandera: '🇰🇮' },
  { codigo: '+965', nombre: 'Kuwait', bandera: '🇰🇼' },
  { codigo: '+856', nombre: 'Laos', bandera: '🇱🇦' },
  { codigo: '+266', nombre: 'Lesoto', bandera: '🇱🇸' },
  { codigo: '+371', nombre: 'Letonia', bandera: '🇱🇻' },
  { codigo: '+961', nombre: 'Líbano', bandera: '🇱🇧' },
  { codigo: '+231', nombre: 'Liberia', bandera: '🇱🇷' },
  { codigo: '+218', nombre: 'Libia', bandera: '🇱🇾' },
  { codigo: '+423', nombre: 'Liechtenstein', bandera: '🇱🇮' },
  { codigo: '+370', nombre: 'Lituania', bandera: '🇱🇹' },
  { codigo: '+352', nombre: 'Luxemburgo', bandera: '🇱🇺' },
  { codigo: '+853', nombre: 'Macao', bandera: '🇲🇴' },
  { codigo: '+389', nombre: 'Macedonia del Norte', bandera: '🇲🇰' },
  { codigo: '+261', nombre: 'Madagascar', bandera: '🇲🇬' },
  { codigo: '+60', nombre: 'Malasia', bandera: '🇲🇾' },
  { codigo: '+265', nombre: 'Malaui', bandera: '🇲🇼' },
  { codigo: '+960', nombre: 'Maldivas', bandera: '🇲🇻' },
  { codigo: '+223', nombre: 'Malí', bandera: '🇲🇱' },
  { codigo: '+356', nombre: 'Malta', bandera: '🇲🇹' },
  { codigo: '+212', nombre: 'Marruecos', bandera: '🇲🇦' },
  { codigo: '+596', nombre: 'Martinica', bandera: '🇲🇶' },
  { codigo: '+230', nombre: 'Mauricio', bandera: '🇲🇺' },
  { codigo: '+222', nombre: 'Mauritania', bandera: '🇲🇷' },
  { codigo: '+262', nombre: 'Mayotte/Reunión', bandera: '🇾🇹' },
  { codigo: '+52', nombre: 'México', bandera: '🇲🇽' },
  { codigo: '+691', nombre: 'Micronesia', bandera: '🇫🇲' },
  { codigo: '+373', nombre: 'Moldavia', bandera: '🇲🇩' },
  { codigo: '+377', nombre: 'Mónaco', bandera: '🇲🇨' },
  { codigo: '+976', nombre: 'Mongolia', bandera: '🇲🇳' },
  { codigo: '+382', nombre: 'Montenegro', bandera: '🇲🇪' },
  { codigo: '+1664', nombre: 'Montserrat', bandera: '🇲🇸' },
  { codigo: '+258', nombre: 'Mozambique', bandera: '🇲🇿' },
  { codigo: '+95', nombre: 'Myanmar (Birmania)', bandera: '🇲🇲' },
  { codigo: '+264', nombre: 'Namibia', bandera: '🇳🇦' },
  { codigo: '+674', nombre: 'Nauru', bandera: '🇳🇷' },
  { codigo: '+977', nombre: 'Nepal', bandera: '🇳🇵' },
  { codigo: '+505', nombre: 'Nicaragua', bandera: '🇳🇮' },
  { codigo: '+227', nombre: 'Níger', bandera: '🇳🇪' },
  { codigo: '+234', nombre: 'Nigeria', bandera: '🇳🇬' },
  { codigo: '+683', nombre: 'Niue', bandera: '🇳🇺' },
  { codigo: '+672', nombre: 'Isla Norfolk', bandera: '🇳🇫' },
  { codigo: '+47', nombre: 'Noruega', bandera: '🇳🇴' },
  { codigo: '+687', nombre: 'Nueva Caledonia', bandera: '🇳🇨' },
  { codigo: '+64', nombre: 'Nueva Zelanda', bandera: '🇳🇿' },
  { codigo: '+968', nombre: 'Omán', bandera: '🇴🇲' },
  { codigo: '+31', nombre: 'Países Bajos', bandera: '🇳🇱' },
  { codigo: '+92', nombre: 'Pakistán', bandera: '🇵🇰' },
  { codigo: '+680', nombre: 'Palaos', bandera: '🇵🇼' },
  { codigo: '+970', nombre: 'Palestina', bandera: '🇵🇸' },
  { codigo: '+507', nombre: 'Panamá', bandera: '🇵🇦' },
  { codigo: '+675', nombre: 'Papúa N. Guinea', bandera: '🇵🇬' },
  { codigo: '+595', nombre: 'Paraguay', bandera: '🇵🇾' },
  { codigo: '+51', nombre: 'Perú', bandera: '🇵🇪' },
  { codigo: '+689', nombre: 'Polinesia Francesa', bandera: '🇵🇫' },
  { codigo: '+48', nombre: 'Polonia', bandera: '🇵🇱' },
  { codigo: '+351', nombre: 'Portugal', bandera: '🇵🇹' },
  { codigo: '+1787', nombre: 'Puerto Rico', bandera: '🇵🇷' },
  { codigo: '+974', nombre: 'Qatar', bandera: '🇶🇦' },
  { codigo: '+236', nombre: 'Rep. Centroafricana', bandera: '🇨🇫' },
  { codigo: '+420', nombre: 'Rep. Checa', bandera: '🇨🇿' },
  { codigo: '+243', nombre: 'Rep. Dem. del Congo', bandera: '🇨🇩' },
  { codigo: '+242', nombre: 'Rep. del Congo', bandera: '🇨🇬' },
  { codigo: '+1809', nombre: 'Rep. Dominicana', bandera: '🇩🇴' },
  { codigo: '+262', nombre: 'Reunión/Mayotte', bandera: '🇷🇪' }, 
  { codigo: '+250', nombre: 'Ruanda', bandera: '🇷🇼' },
  { codigo: '+40', nombre: 'Rumania', bandera: '🇷🇴' },
  { codigo: '+212', nombre: 'Sahara Occidental', bandera: '🇪🇭' },
  { codigo: '+685', nombre: 'Samoa', bandera: '🇼🇸' },
  { codigo: '+1684', nombre: 'Samoa Americana', bandera: '🇦🇸' },
  { codigo: '+1869', nombre: 'San Cristóbal y Nieves', bandera: '🇰🇳' },
  { codigo: '+378', nombre: 'San Marino', bandera: '🇸🇲' },
  { codigo: '+508', nombre: 'San Pedro y Miquelón', bandera: '🇵🇲' },
  { codigo: '+1784', nombre: 'San Vicente y Granadinas', bandera: '🇻🇨' },
  { codigo: '+290', nombre: 'Santa Elena', bandera: '🇸🇭' },
  { codigo: '+1758', nombre: 'Santa Lucía', bandera: '🇱🇨' },
  { codigo: '+239', nombre: 'Santo Tomé y Príncipe', bandera: '🇸🇹' },
  { codigo: '+221', nombre: 'Senegal', bandera: '🇸🇳' },
  { codigo: '+381', nombre: 'Serbia', bandera: '🇷🇸' },
  { codigo: '+248', nombre: 'Seychelles', bandera: '🇸🇨' },
  { codigo: '+232', nombre: 'Sierra Leona', bandera: '🇸🇱' },
  { codigo: '+65', nombre: 'Singapur', bandera: '🇸🇬' },
  { codigo: '+1721', nombre: 'Sint Maarten', bandera: '🇸🇽' },
  { codigo: '+963', nombre: 'Siria', bandera: '🇸🇾' },
  { codigo: '+252', nombre: 'Somalia', bandera: '🇸🇴' },
  { codigo: '+94', nombre: 'Sri Lanka', bandera: '🇱🇰' },
  { codigo: '+27', nombre: 'Sudáfrica', bandera: '🇿🇦' },
  { codigo: '+211', nombre: 'Sudán del Sur', bandera: '🇸🇸' },
  { codigo: '+249', nombre: 'Sudán', bandera: '🇸🇩' },
  { codigo: '+46', nombre: 'Suecia', bandera: '🇸🇪' },
  { codigo: '+41', nombre: 'Suiza', bandera: '🇨🇭' },
  { codigo: '+597', nombre: 'Surinam', bandera: '🇸🇷' },
  { codigo: '+47', nombre: 'Svalbard y Jan Mayen', bandera: '🇸🇯' },
  { codigo: '+66', nombre: 'Tailandia', bandera: '🇹🇭' },
  { codigo: '+886', nombre: 'Taiwán', bandera: '🇹🇼' },
  { codigo: '+255', nombre: 'Tanzania', bandera: '🇹🇿' },
  { codigo: '+992', nombre: 'Tayikistán', bandera: '🇹🇯' },
  { codigo: '+670', nombre: 'Timor Oriental', bandera: '🇹🇱' },
  { codigo: '+228', nombre: 'Togo', bandera: '🇹🇬' },
  { codigo: '+690', nombre: 'Tokelau', bandera: '🇹🇰' },
  { codigo: '+676', nombre: 'Tonga', bandera: '🇹🇴' },
  { codigo: '+1868', nombre: 'Trinidad y Tobago', bandera: '🇹🇹' },
  { codigo: '+216', nombre: 'Túnez', bandera: '🇹🇳' },
  { codigo: '+993', nombre: 'Turkmenistán', bandera: '🇹🇲' },
  { codigo: '+90', nombre: 'Turquía', bandera: '🇹🇷' },
  { codigo: '+688', nombre: 'Tuvalu', bandera: '🇹🇻' },
  { codigo: '+380', nombre: 'Ucrania', bandera: '🇺🇦' },
  { codigo: '+256', nombre: 'Uganda', bandera: '🇺🇬' },
  { codigo: '+598', nombre: 'Uruguay', bandera: '🇺🇾' },
  { codigo: '+998', nombre: 'Uzbekistán', bandera: '🇺🇿' },
  { codigo: '+678', nombre: 'Vanuatu', bandera: '🇻🇺' },
  { codigo: '+379', nombre: 'Vaticano', bandera: '🇻🇦' },
  { codigo: '+58', nombre: 'Venezuela', bandera: '🇻🇪' },
  { codigo: '+84', nombre: 'Vietnam', bandera: '🇻🇳' },
  { codigo: '+681', nombre: 'Wallis y Futuna', bandera: '🇼🇫' },
  { codigo: '+967', nombre: 'Yemen', bandera: '🇾🇪' },
  { codigo: '+253', nombre: 'Yibuti', bandera: '🇩🇯' },
  { codigo: '+260', nombre: 'Zambia', bandera: '🇿🇲' },
  { codigo: '+263', nombre: 'Zimbabue', bandera: '🇿🇼' },
];

interface PhoneInputProps {
  codigo_pais: string;
  numero: string;
  onCodigoPaisChange: (codigo: string) => void;
  onNumeroChange: (numero: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function PhoneInput({
  codigo_pais,
  numero,
  onCodigoPaisChange,
  onNumeroChange,
  disabled = false,
  label = 'Teléfono',
  placeholder = '70123456',
}: PhoneInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Select value={codigo_pais} onValueChange={onCodigoPaisChange} disabled={disabled}>
          <SelectTrigger className="w-[140px] hover:border-primary/50 focus:border-primary transition-all duration-200">
            <SelectValue placeholder="Código" />
          </SelectTrigger>
          <SelectContent>
            {codigos_paises.map((pais) => (
              <SelectItem key={pais.codigo} value={pais.codigo}>
                <div className="flex items-center gap-2">
                  <span>{pais.bandera}</span>
                  <span>{pais.codigo}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={numero}
          onChange={(e) => {
            const valor = e.target.value.replace(/[^\d]/g, '');
            onNumeroChange(valor);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 hover:border-primary/50 focus:border-primary transition-all duration-200"
          maxLength={15}
        />
      </div>
    </div>
  );
}

export function formatearTelefonoCompleto(codigo_pais: string, numero: string): string {
  return `${codigo_pais}${numero}`;
}

export function separarTelefono(telefono_completo: string): { codigo_pais: string; numero: string } {
  if (!telefono_completo) {
    return { codigo_pais: '+591', numero: '' };
  }

  const pais_encontrado = codigos_paises.find(p => telefono_completo.startsWith(p.codigo));
  
  if (pais_encontrado) {
    return {
      codigo_pais: pais_encontrado.codigo,
      numero: telefono_completo.substring(pais_encontrado.codigo.length),
    };
  }

  return { codigo_pais: '+591', numero: telefono_completo };
}