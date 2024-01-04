using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using System;

public class DialogueControl : MonoBehaviour
{
    [Header("Components")]
    public GameObject dialogueObj;
    public Image profile;
    public Text speechText;
    public Text actorNameText;

    [Header("dialogue Buttons")]
    public GameObject nextButton;
    public GameObject continueGroup;

    [Header("Settings")]
    public float typingSpeed;

    private string[] sentences;
    private bool acceptInput;
    private int lettersTyped;
    private bool mouseClicked;
    private Sprite[] sprites;
    private string[] names;
    public int index;

    

    public Action onDialogueClose = () => { };
    public Action onRefuseBros = () => { };
    public Action onBrosConcluded = () => { };

    public static DialogueControl Instance;

    public bool isBros = false;


    private void Start() {
        Instance = this;
    }

    public void Speech(Sprite[] p, string[] txt, string[] actorName) {

        TimerController.Instance.isPaused = true;

        speechText.text = "";
        dialogueObj.SetActive(true);
        sprites = p;
        sentences = txt;
        names = actorName;

        //foreach (object obj in sprites) {
        //    print(sprites.Length);
        //}

        ResetDialogue();

        if (isBros) {

           
            nextButton.SetActive(false);
            continueGroup.SetActive(true);

        } else {
            continueGroup.SetActive(false);
            nextButton.SetActive(true);
        }

        StartCoroutine(TypeSentence());


    }

    IEnumerator TypeSentence()
    {
        acceptInput = false;
        lettersTyped = 0;

        profile.sprite  = sprites[index];
        actorNameText.text = names[index];

        float elapsedTime = 0f;
        mouseClicked = false;

        for (int i = 0; i < sentences[index].Length; i++)
        {
            

            speechText.text += sentences[index][i];
            lettersTyped++;

            if (lettersTyped == 3)
            {
                acceptInput = true;
            }

            elapsedTime = 0f;
            while (elapsedTime < typingSpeed)
            {
                elapsedTime += Time.deltaTime;

                if (acceptInput && Input.GetMouseButtonDown(0))
                {
                    mouseClicked = true;
                    break;
                }

                yield return null; 
            }

            if (mouseClicked)
            {
                speechText.text = sentences[index];
                break;
            }

            
        }
    }

    public void NextSentence()
    {
        if(speechText.text == sentences[index] && mouseClicked == false)
        {
            if (index < sentences.Length - 1)
            {
                index++;
                speechText.text = "";
                StartCoroutine(TypeSentence());
            }
            else
            {
                Close();
               
            }
        }
        mouseClicked = false;
    }

    public void Close()
    {
        speechText.text = "";
        dialogueObj.SetActive(false);

        TimerController.Instance.isPaused = false;

        onDialogueClose();

        if (isBros)
            onBrosConcluded();



    }

    public void ResetDialogue() {


        index = 0;

        //speechText.text = "";
        //dialogueObj.SetActive(false);
        //onDialogueClose();


    }

    public void OnRefuseBros() {

        speechText.text = "";
        dialogueObj.SetActive(false);

        TimerController.Instance.isPaused = false;
        onDialogueClose();

        onRefuseBros();


    }

   

}
