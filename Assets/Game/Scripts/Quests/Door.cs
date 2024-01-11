using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class Door : MonoBehaviour
{
    PlayerController playerController;

    public Dialogue dialogue;
    public GameObject doorBright;
    public LayerMask thisLayer;

    public Quest[] quests = new Quest[3];

    public int[] dialogueIndexRangeStart = new int[2];
    public int[] dialogueIndexRangeEnd = new int[2];

   

    [HideInInspector]
    public bool isInteractable;



    //-------------------------------------------------------------------
    [HideInInspector] public int[] dialogueIndexRangeMiddle = new int[2];
    [HideInInspector] public int[] dialogueIndexRangePostEnd = new int[2];

    // Start is called before the first frame update
    void Start()
    {
        playerController = PlayerController.Instance;
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

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray());            
        
        }else {

            print("Quests concluídas!!!");

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray());

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


}