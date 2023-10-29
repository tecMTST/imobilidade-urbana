using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundManager : MonoBehaviour
{
    //Lista de Músicas:
    [SerializeField] private AudioClip ambienteTrem1;
    [SerializeField] private AudioClip sonoroLightTrem1;
    [SerializeField] private AudioClip sonoroDarkTrem2;
    [SerializeField] private AudioClip aununcioTrem1;
    [SerializeField] private AudioClip aununcioTrem2;
    [SerializeField] private AudioClip aununcioTrem3;
    [SerializeField] private AudioClip aununcioTrem4;

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
        aununcioTrem4
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

    //Iniciação do SoundManager:
    void Awake()
    {
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
            aununcioTrem4
        };

        //Setar Vetor de SFX:
        selectSFX = new AudioClip[]
        {
            menuLuz
        };

        //Carregar BGM:
        playBGM(0, 1);
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
        sfxGame.clip = selectBGM[lista];
        sfxGame.Play();
    }

    //Parar SFX Game:
    public void stopSFX()
    {
        sfxGame.Stop();
        sfxGame.clip = null;
    }
}
