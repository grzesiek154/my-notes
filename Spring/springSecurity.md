# Tokens

To put simply, **JWT (JSON Web Token)** is a way of representing claims which are name-value pairs into a JSON object. JWT [spec](https://tools.ietf.org/html/rfc7519) defines a set of standard claims to be used or transferred between two parties.

On the other hand, **JWS (JSON Web Signature)** is a mechanism for transferring JWT payload between two parties with guarantee for Integrity. 

# OAuth vs JWT

OAuth 2.0 defines a protocol, i.e. specifies how tokens are transferred, JWT defines a token format.

OAuth 2.0 and "JWT authentication" have similar appearance when it  comes to the (2nd) stage where the Client presents the token to the  Resource Server: the token is passed in a header. 

But "JWT authentication" is not a standard and does not specify *how* the Client obtains the token in the first place (the 1st stage). That  is where the perceived complexity of OAuth comes from: it also defines  various ways in which the Client can *obtain* an access token from something that is called an Authorization Server. 

So the real difference is that JWT is just a token format, OAuth 2.0 is a protocol (that *may* use a JWT as a token format).

# CSRF VS CORS

CSRF is a vulnerability and CORS is a method to relax the same-origin policy. CORS is something you might want to use (in certain circumstances) whereas CSRF is an undesirable design mistake.

There are vulnerabilities associated with the CORS mechanism. For example you might accidentally allow all websites to include scripts (wildcard *) which would enable all sorts of nasty things that resemble CSRF attacks but also other attacks such as stealing information (incl. CSRF tokens) and create injections that perform like XSS or even harness the resources of the poorly configured service. It all depends on the application and the exploit. But poorly configured CORS certainly enables CSRF in certain cases where it would not be possible otherwise.

Sometimes CORS is also associated with the protection methods of how to prevent CSRF attacks. The most typical way to mitigate the attack is to use anti-CSRF tokens but it is also possible to prevent the attack by checking the Origin: or Referer: header which is related to CORS. But it is useful to notice that this is more complicated than it sounds and it is not a good idea to assume that good CORS rules will prevent all CSRF attacks.



# JWT vs JWS

> JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JavaScript Object Notation (JSON) object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or MACed and/or encrypted.

So a JWT is a JWS structure with a JSON object as the payload. Some optional keys (or claims) have been defined such as `iss`, `aud`, `exp` etc.

This also means that its integrity protection is not just limited to  shared secrets but public/private key cryptography can also be used.



# JKS and PKCS12 cert generation

 

```bash
keytool -genkey -alias notebook -keyalg RSA -keystore notebook.jks -keysize 2048
```

```bash
 keytool -importkeystore -srckeystore notebook.jks -destkeystore notebook.jks -deststoretype pkcs12
```

