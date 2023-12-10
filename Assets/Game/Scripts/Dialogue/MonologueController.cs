using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Unity.VisualScripting.FullSerializer;
using UnityEngine;
using UnityEngine.UI;

public class MonologueController : MonoBehaviour
{
    [Header("Components")]
    public GameObject monologueObj;
    public GameObject timer;
    public GameObject timerController;
    public GameObject moveArrowRight;
    public GameObject moveArrowLeft;
    public GameObject lightTgl;

    public GameObject player;

    public GameObject monster1;
    public GameObject monster2;
    public GameObject soundManager;
    public Image profile;
    public Text speechText;
    public Text actorNameText;

    [Header("dialogue Buttons")]
    public GameObject nextButton;

    [Header("Settings")]
    [Range(0, 0.5f)] public float typingSpeed;

    [Header("Fala Inicial")]
    public string[] falaInicial;

    [Header("Fala da Porta Emperrada")]
    public string[] portaEmperrada;

    [Header("Fala da Sala Escura")]
    public string[] ligarLanterna;

    [Header("Fala de Desligar a Lanterna")]
    public string[] desligarLanterna;

    private string[] sentences;
    public Sprite imagePlayer;
    public Sprite imageSound;
    public string name;
    public string anunciante;
    private int index;
    private int controleDeFala = 0;

    private bool falouPraLigarLanterna = false;
    private bool falouPraDesligarLanterna = false;

    private GameObject activeMonster;
    private bool monsterNear = false;

    private bool falaAnunciante = true;
    private bool jaFalouAnunciante = false;


    private void Start() {
        timer.SetActive(false);
        moveArrowRight.SetActive(false);
        moveArrowLeft.SetActive(false);
        lightTgl.SetActive(false);

        Speech(falaInicial);
    }

    void Update()
    {
        

        if (falouPraLigarLanterna == false) {

            int playerRoom = player.GetComponent<PlayerController>().GetRoomIndex();

            if (playerRoom == 6) {
                monster1.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster1;
                Speech(ligarLanterna);
            } else if (playerRoom == 8) {
                monster2.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster2;
                Speech(ligarLanterna);
            }
            
        } else if (falouPraDesligarLanterna == false) {

            int playerRoom = player.GetComponent<PlayerController>().GetRoomIndex();

            if (playerRoom == 6) {
                monsterNear = monster1.GetComponent<Monster1>().IsNearPlayer();
                activeMonster = monster1;
            } else if (playerRoom == 8) {
                monsterNear = monster2.GetComponent<Monster1>().IsNearPlayer();
                activeMonster = monster2;
            }

            if(monsterNear && playerRoom == 6) {
                monster1.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster1;
                Speech(desligarLanterna);
            } else if(monsterNear && playerRoom == 8) {
                monster2.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster2;
                Speech(desligarLanterna);
            }

        }

    }

    public void Speech(string[] txt) {

        timerController.GetComponent<TimerController>().PauseTimer();
        player.GetComponent<PlayerController>().StopMoving();
        moveArrowRight.SetActive(false);
        moveArrowLeft.SetActive(false);


        speechText.text = "";
        monologueObj.SetActive(true);
        sentences = txt;
        index = 0;

        StartCoroutine(TypeSentence(false));
    }



    IEnumerator TypeSentence(bool isAnunciante)
    {
        if (isAnunciante) {
            profile.sprite = imageSound;
            actorNameText.text = anunciante;
            soundManager.GetComponent<SoundManager>().playAnuncioTimer();
        } else
        {
            profile.sprite = imagePlayer;
            actorNameText.text = name;
        }
        
        foreach (char letter in sentences[index].ToCharArray())
        {
            speechText.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
    }

    public void NextSentence()
    {
        if(speechText.text == sentences[index])
        {
            if (index < sentences.Length - 1)
            {
                index++;
                speechText.text = "";

                if (falaAnunciante && !jaFalouAnunciante){
                    jaFalouAnunciante = true;
                    StartCoroutine(TypeSentence(true));
                } else
                {
                    StartCoroutine(TypeSentence(false));
                }
                
            }
            else
            {
                speechText.text = "";
               
                monologueObj.SetActive(false);

                if (controleDeFala == 0) {
                    controleDeFala++;
                    timer.SetActive(true);

                    Speech(portaEmperrada);

                } else if(controleDeFala == 1) {

                    controleDeFala++;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);

                } else if(controleDeFala == 2) {

                    falouPraLigarLanterna = true;
                    controleDeFala++;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    lightTgl.SetActive(true);
                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);
                    activeMonster.GetComponent<Monster1>().StopDialogue();
                } else {
                    falouPraDesligarLanterna = true;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);
                    activeMonster.GetComponent<Monster1>().StopDialogue();
                    
                }
            }
        }
    }
}
