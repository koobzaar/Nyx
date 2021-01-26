# Nyx 
### Gerenciador automático em electron para o cliente do League of Legends

Nyx tem como principal função automatizar ações e diminuir interações usuário-client. Programado em Electron, conta com ferramentas que manipulam requests client>server via LCU.
## Problemáticas e funcionalidades do Nyx

  - Invocadores com grande tempo de fila normalmente ficam longe do teclado enquanto aguardam a verificação de prontidão da partida.

Partindo desse pressuposto, desenvolvemos uma ferramenta que interage com a verificação de prontidão e automaticamente aceita a fila para o usuário. Posteriormente, bane o campeão selecionado e escolhe o personagem desejado com base em uma lista previamente declarada pelo usuário. 
Recomendamos o uso [software Blitz](https://blitz.gg/) para criação de runas com base no picks, diminuindo totalmente a interação do jogador com o cliente na fase de pré-jogo.

- No lançamento de campeões novos para o jogo, fica praticamente impossível jogar com o mesmo em partidas gerenciadas sem que haja um grupo pré-definido no lobby.

Com isso, criamos a funcionalidade de selecionar instantaneamente qualquer campeão do jogo na modalidade Escolha as Cegas antes de qualquer tempo de reação de um jogador na seleção de campeões, garantindo que você jogará com aquele personagem independente de qualquer coisa.

Você também pode:
  - Visualizar seu ping in-game antes de iniciar uma partida;
  - Visualizar seu ping em outras partes do client, como o servidor de Login, Client e o de Chat para diagnóstico de problemas de conexão;
  - Definir mensagem personalizada sem limite de caracteres;
  - Definir sua disponibilidade para qualquer uma do jogo, podendo ficar invisível mesmo estando online;
  - Alterar seu elo para qualquer classificação do jogo na lista de amigos;
  - Liberar o bônus de batalha no ARAM (boost) mesmo sem ter RP's suficientes.


### LICENÇA - O que eu posso fazer com esse software?

- O código-fonte obrigatoriamente deve ser público sempre que uma distribuição do software é feita;
- Modificações do software devem ser lançadas sob os mesmos requisitos aqui apresentados;
- Mudanças feitas no código-fonte precisam obrigatoriamente ser documentadas;
- Se material for usado na criação do software, ele concede o direito aos usuários de usá-lo. Se o usuário processar qualquer pessoa com o uso do material patenteado, eles perderão o direito de usar o software;
- Proíbido o uso de nomes de marcas registradas no projeto;
- É proibido o uso comercial desse software como um todo ou em partes;
- O uso do código é permitido (com as restrições aqui apresentadas) desde que o nome seja modificado.
- O software é distribuído sem garantia. Eu, como autor, e esta licença não podem ser responsabilizados por possíveis perdas ou danos pelo uso do software. Usar o codigo dos outros e fazer birra quando ele está errado faz de você um ASNO imbecil. Conserte o problema você mesmo. Um não-idiota submeteria as correções de volta.
- Proibido modificar o trabalho original para ocultar conteúdo malicioso. Isso faria de você um COMPLETO idiota.  


## Releases
 Atualmente se encontra em Alpha. Não há previsões para o lançamento oficial.
Você pode baixar a versão mais recente através desse link:
> https://github.com/koobzaar/Nyx/releases

### Instalação

```sh
$ cd Nyx/
$ npm install 
$ npm start
```

### Agradecimentos, contribuições e contato

Fvck [Break](https://github.com/BreakXD) do LeagueTags.
Caso queira me ajudar a desenvolver este software, você pode me contactar através das seguintes plataformas:
| Plataforma | Contato |
| ------ | ------ |
| Discord - Usuário| Kobzar#4164  |
| Discord - Meu ID| 225585864200290304 |
| Discord - Meu Servidor|  https://discord.gg/zREzYzB |
| E-mail | bruno.trigueiro@outlook.com |
| League of Legends #1 | Kobzar |
| League of Legends #2 | Kycorax |

Há uma possibilidade maior de eu aceitar sua solicitação na conta Kycorax ao invés da Kobzar.


Feito com o ❤  por Bruno Trigueiro.
