using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.SocialPlatforms;

public class SoundManager : MonoBehaviour
{
    //Scene Manager:
    private Scene currentScene;

    //Lista de Musicas:
    [SerializeField] private AudioClip ambienteTrem;
    [SerializeField] private AudioClip musicaAnuncioTrem;
    [SerializeField] private AudioClip musicaChase;
    [SerializeField] private AudioClip musicaGameOver;
    [SerializeField] private AudioClip aununcioTremInicio;
    [SerializeField] private AudioClip aununcioTrem1;
    [SerializeField] private AudioClip aununcioTrem2;
    [SerializeField] private AudioClip aununcioTrem3;
    [SerializeField] private AudioClip aununcioTrem4;
    [SerializeField] private AudioClip aununcioTrem5;
    [SerializeField] private AudioClip aununcioTrem6;

    //Vetor Lista de Musicas:
    private AudioClip[] selectBGM;

    //Vetor Auxiliar Lista de Musicas:
    public enum ListaBGM
    {
        ambienteTrem,
        musicaAnuncioTrem,
        musicaChase,
        musicaGameOver,
        aununcioTremInicio,
        aununcioTrem1,
        aununcioTrem2,
        aununcioTrem3,
        aununcioTrem4,
        aununcioTrem5,
        aununcioTrem6
    };


    //Lista de Efeitos:
    [SerializeField] private AudioClip sonoroLuz;
    [SerializeField] private AudioClip sonoroScream;
    [SerializeField] private AudioClip sonoroTimer;

    //Vetor Lista de Efeitos:
    private AudioClip[] selectSFX;

    //Vetor Auxiliar Lista de Efeitos:
    public enum ListaSFX
    {
        sonoroLuz,
        sonoroScream,
        sonoroTimer,
    };

    //Lista de AudioSources Simultaneos:
    public AudioSource bgmAmbiente;
    public AudioSource bgmAnuncios;
    public AudioSource bgmChase;
    public AudioSource bgmTela;
    public AudioSource sfxMenu;
    public AudioSource sfxTexto;
    public AudioSource sfxScream;

    //Outras Variaveis:
    public static SoundManager instance;
    private float anuncioSFX = 200.0f;
    private float timerAnuncio = 80.0f;
    private bool segurarAnuncio = false;
    private bool setFade = false;
    private bool falouPrimeiroAnuncio = false;
    private bool deveFalarPrimeiroAnuncio = false;
    private float timerFade = 0.95f;
    private bool isTimePaused;

    public GameObject timerController;

    //Iniciar SoundManager:
    void Awake()
    {
        //Scene Manager:
        currentScene = SceneManager.GetActiveScene();

        //Setar Instancia:
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
            ambienteTrem,
            musicaAnuncioTrem,
            musicaChase,
            musicaGameOver,
            aununcioTremInicio,
            aununcioTrem1,
            aununcioTrem2,
            aununcioTrem3,
            aununcioTrem4,
            aununcioTrem5,
            aununcioTrem6
        };

        //Setar Vetor de SFX:
        selectSFX = new AudioClip[]
        {
            sonoroLuz,
            sonoroScream,
            sonoroTimer,
        };

        //Carregar BGM - Cena do Trem:
        if (currentScene.name == "TrainScene")
        {
            playBGM(0, 1);
        }
    }

    void Update()
    {
        isTimePaused = timerController.GetComponent<TimerController>().GetIsPaused();
        //Tema do Trem e Anuncios:
        if (currentScene.name == "TrainScene")
        {
            if (falouPrimeiroAnuncio && isTimePaused == false)
            {
                timerAnuncio = timerAnuncio + Time.deltaTime;
                if (!segurarAnuncio && timerAnuncio >= anuncioSFX)
                {
                    playBGM(1, 2);
                    segurarAnuncio = true;
                }
                else if (segurarAnuncio && !bgmAnuncios.isPlaying)
                {
                    playBGM(UnityEngine.Random.Range(3, 10), 2);
                    segurarAnuncio = false;
                    timerAnuncio = 0f;
                }
            } else if (deveFalarPrimeiroAnuncio)
            {
                deveFalarPrimeiroAnuncio = false;
                falouPrimeiroAnuncio = true;
                playBGM(4, 2);
                segurarAnuncio = false;
                timerAnuncio = 0f;
            }
        }

        //Fade AudioSource Chase:
        if (setFade)
        {
            //Decrescer:
            bgmChase.volume = (float)bgmChase.volume * timerFade;

            //Desligar:
            if (bgmChase.volume < 0.01f)
            {
                setFade = false;
                bgmChase.Stop();
                bgmChase.clip = null;
            }
        }
    }

    //Tocar BGM:
    public void playBGM(int lista,int track)
    {
        //AudioSource Ambiente:
        if (bgmAmbiente.clip != selectBGM[lista] && track == 1)
        {
            //Tocar Nova Musica:
            bgmAmbiente.clip = selectBGM[lista];
            bgmAmbiente.Play();
        }

        //AudioSource Anuncios:
        if (bgmAnuncios.clip != selectBGM[lista] && track == 2)
        {
            //Tocar Nova Musica:
            bgmAnuncios.clip = selectBGM[lista];
            bgmAnuncios.Play();
        }

        //AudioSource Chase:
        if (track == 3)
        {
            //Tocar Nova Musica:
            bgmChase.clip = selectBGM[lista];
            bgmChase.Play();
            bgmChase.volume = 1;
            setFade = false;
        }
    }

    //Parar BGM:
    public void stopBGM(int track)
    {
        //AudioSource Ambiente:
        if (track == 1)
        {
            bgmAmbiente.Stop();
            bgmAmbiente.clip = null;
        }

        //AudioSource Anuncios:
        if (track == 2)
        {
            bgmAnuncios.Stop();
            bgmAnuncios.clip = null;
        }

        //AudioSource Chase:
        if (track == 3)
        {
            setFade = true;
        }
    }

    //Tocar SFX Menu:
    public void playMenuSFX(int lista)
    {
        sfxMenu.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Texto:
    public void playTextSFX(int lista)
    {
        sfxTexto.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Scream:
    public void playScreamSFX()
    {
        sfxScream.PlayOneShot(selectSFX[1]);
    }

    //Timer:
    public void playAnuncioTimer()
    {
        deveFalarPrimeiroAnuncio = true;
    }
}
