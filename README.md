## Generación de certificados SSL autofirmados

Clave privada:
openssl genpkey -algorithm RSA -out llave-privada.key

Solicitud CSR:
openssl req -new -key llave-privada.key -out request.csr

Certificado autofirmado:
openssl req -x509 -key llave-privada.key -in request.csr -out certificado.crt -days 365