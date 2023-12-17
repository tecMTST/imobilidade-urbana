Imobilidade Urbana
---


## Como publicar a versão alpha

Basta compilar o jogo com o target `WebGL` e salvar os arquivos
na pasta `docs/`. Ao realizar o `git push` da pasta `docs/` o
site automaticamente atualizará em menos de 5 minutos.

Para compilar via CLI, use o seguinte comando:

```
Unity -quit -batchmode -buildTarget WebGL -force-free -executeMethod Build.BuildWebGL
```

Note que `Unity` se refere ao binário do seu Unity Editor e assume que ele está
presente na sua variável `$PATH`. Corrija o caminho do binário se necessário.

