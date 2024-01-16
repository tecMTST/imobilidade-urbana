using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class Door : MonoBehaviour {
    PlayerController playerController;

    public Dialogue dialogue;
    public GameObject doorBright;
    public LayerMask thisLayer;

    public Quest[] quests = new Quest[3];

    public int[] dialogueIndexRangeStart = new int[2];
    public int[] dialogueIndexRangeEnd = new int[2];



    [HideInInspector]
    public bool isInteractable;

   SceneLoader sceneLoader;


    //-------------------------------------------------------------------
    [HideInInspector] public int[] dialogueIndexRangeMiddle = new int[2];
    [HideInInspector] public int[] dialogueIndexRangePostEnd = new int[2];

    // Start is called before the first frame update
    void Start() {

        DontDestroyOnLoad(this);

        playerController = PlayerController.Instance;

        try {
            sceneLoader = new();
            sceneLoader.LoadSceneAsync("EndingScene");
        } catch { }
        
        
    }

    // Update is called once per frame
    void Update()
    {
        doorBright.SetActive(isInteractable = IsInteractable());

        if (isInteractable) {

            
            if ((Input.GetMouseButtonDown(0) || Input.touchCount > 0)) {
                Vector3 clickPosition;

                clickPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                if (Input.touchCount > 0) {
                    Touch touch = Input.GetTouch(Input.touchCount - 1);
                    clickPosition = Camera.main.ScreenToWorldPoint(touch.position);
                }
                clickPosition.z = 0;

                Vector2 clickPosition2D = new Vector2(clickPosition.x, clickPosition.y);
                Collider2D hitCollider = Physics2D.OverlapPoint(clickPosition2D, dialogue.npcLayer);
                if (hitCollider != null) {


                    if (hitCollider.gameObject == gameObject) {
                        Interact();
                    }
                }
            }

        } 

    }

    public void Interact() {

        if (dialogue.onDialogue) {
            return;
        }

        if (!VerifyQuests()) {//Quests não concluídas
            print("Quests não concluídas");

            SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroPortaTravada);

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray());
        
        }else {

            print("Quests concluídas!!!");

            //ATENÇÃO. Colocar esse som após um fade tela escura. Ele tem que tocar quando a tela estiver 100% escura e após o termino dele, tocar a cutscene final.
            SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroPortaAbrindo);

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray());

            dialogue.dc.onDialogueClose = End;
            

        }

        return;


    }

    private bool VerifyQuests() {
        
        foreach(Quest quest in quests) {
            if (!quest.concluded)
                return false;
        }

        return true;
    }

    public bool IsInteractable() {
        return MathF.Abs(playerController.transform.position.x - this.transform.position.x) < 2.5f;
    }


    public void End() {
        StartCoroutine(GoToTheEnd());
    }
    public IEnumerator GoToTheEnd() {

        foreach (Transform child in GetComponentsInChildren<Transform>()) {
            
            if(child.name == "door")
                continue;
            print(child.name);
            child.gameObject.SetActive(false);
        }

        this.GetComponent<SpriteRenderer>().enabled = false;
        this.GetComponent<Animator>().enabled = false;
        this.GetComponent<Collider2D>().enabled = false;
                

        Animation finalFade = GameManagement.FindFadeImageByTag("FinalFade", true);

        finalFade.gameObject.SetActive(true);
        finalFade.Play("FinalFadeOut");

        yield return new WaitUntil(() => !finalFade.IsPlaying("FinalFadeOut"));

        sceneLoader.AllowSceneActivation(true);
        finalFade.Play("FinalFadeIn");

        yield return new WaitUntil(() => !finalFade.IsPlaying("FinalFadeIn"));

        sceneLoader.AllowSceneActivation(false);

        StopCoroutine(nameof(GoToTheEnd));

        Destroy(this.gameObject);

    }


}
