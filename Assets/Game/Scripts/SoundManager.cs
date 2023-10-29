using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SoundManager : MonoBehaviour
{
    //Scene Manager:
    private Scene currentScene;

    //Lista de Músicas:
    [SerializeField] private AudioClip ambienteTrem1;
    [SerializeField] private AudioClip sonoroLightTrem1;
    [SerializeField] private AudioClip sonoroDarkTrem2;
    [SerializeField] private AudioClip aununcioTrem1;
    [SerializeField] private AudioClip aununcioTrem2;
    [SerializeField] private AudioClip aununcioTrem3;
    [SerializeField] private AudioClip aununcioTrem4;
    [SerializeField] private AudioClip aununcioTrem5;
    [SerializeField] private AudioClip aununcioTrem6;
    [SerializeField] private AudioClip aununcioTrem7;
    [SerializeField] private AudioClip aununcioTrem8;

    //Vetor Lista de Músicas:
    private AudioClip[] selectBGM;

    //Vetor Auxiliar Lista de Músicas:
    public enum ListaBGM
    {
        ambienteTrem1,
        sonoroLightTrem1,
        sonoroDarkTrem2,
        aununcioTrem1,
        aununcioTrem2,
        aununcioTrem3,
        aununcioTrem4,
        aununcioTrem5,
        aununcioTrem6,
        aununcioTrem7,
        aununcioTrem8,
    };

    //Lista de Efeitos:
    [SerializeField] private AudioClip menuLuz;

    //Vetor Lista de Efeitos:
    private AudioClip[] selectSFX;

    //Vetor Auxiliar Lista de Efeitos:
    public enum ListaSFX
    {
        menuLuz
    };

    //Lista de AudioSources Simultâneos:
    public AudioSource bgmGame1;
    public AudioSource bgmGame2;
    public AudioSource sfxMenu;
    public AudioSource sfxGame;

    //Outras Variáveis:
    public static SoundManager instance;
    private float anuncioSFX = 100.0f;
    private float timerAnuncio = 95.0f;
    private bool segurarAnuncio = false;

    //Iniciação do SoundManager:
    void Awake()
    {
        //Scene Manager:
        currentScene = SceneManager.GetActiveScene();

        //Setar Instância:
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }

        //Setar Vetor de BGM:
        selectBGM = new AudioClip[]
        {
            ambienteTrem1,
            sonoroLightTrem1,
            sonoroDarkTrem2,
            aununcioTrem1,
            aununcioTrem2,
            aununcioTrem3,
            aununcioTrem4,
            aununcioTrem5,
            aununcioTrem6,
            aununcioTrem7,
            aununcioTrem8,
        };

        //Setar Vetor de SFX:
        selectSFX = new AudioClip[]
        {
            menuLuz
        };

        //Carregar BGM - Cena do Trem:
        if (currentScene.name == "TrainScene")
        {
            playBGM(0, 1);
        }
    }

    void Update()
    {
        //Tema do Trem e Anúncios:
        if (currentScene.name == "TrainScene")
        {
            timerAnuncio = timerAnuncio + Time.deltaTime;
            if (!segurarAnuncio && timerAnuncio >= anuncioSFX)
            {
                playBGM(1, 2);
                segurarAnuncio = true;
                Debug.Log("Tey 1");
            }
            else if (segurarAnuncio && !bgmGame2.isPlaying)
            {
                playBGM(UnityEngine.Random.Range(3, 10), 2);
                segurarAnuncio = false;
                Debug.Log("Tey 2");
                timerAnuncio = 0f;
            }
        }
    }

    //Tocar BGM:
    public void playBGM(int lista,int track)
    {
        //Checar AudioSource BGM1:
        if (bgmGame1.clip != selectBGM[lista] && track == 1)
        {
            //Tocar Nova Música:
            bgmGame1.clip = selectBGM[lista];
            bgmGame1.Play();
        }

        //Checar AudioSource BGM2:
        if (bgmGame2.clip != selectBGM[lista] && track == 2)
        {
            //Tocar Nova Música:
            bgmGame2.clip = selectBGM[lista];
            bgmGame2.Play();
        }
    }

    //Parar BGM:
    public void stopBGM(int track)
    {
        //Checar AudioSource BGM1:
        if (track == 1)
        {
            bgmGame1.Stop();
            bgmGame1.clip = null;
        }

        //Checar AudioSource BGM2:
        if (track == 2)
        {
            bgmGame2.Stop();
            bgmGame2.clip = null;
        }
    }

    //Tocar SFX Menu:
    public void playMenuSFX(int lista)
    {
        sfxMenu.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Game:
    public void playSFX(int lista)
    {
        if (!sfxGame.isPlaying)
        {
            sfxGame.clip = selectBGM[lista];
            sfxGame.Play();
        }
    }

    //Parar SFX Game:
    public void stopSFX()
    {
        sfxGame.Stop();
        sfxGame.clip = null;
    }
}
