using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Quest : MonoBehaviour{

    public bool started = false, concluded = false, itemCaught = false;
    public QuestItem item;
    public Dialogue dialog;

    public int[] dialogueIndexRangeStart = new int[2];
    public int[] dialogueIndexRangeMiddle = new int[2];
    public int[] dialogueIndexRangeEnd = new int[2];
    public int[] dialogueIndexRangePostEnd = new int[2];

    public GameObject questAlert;

    public float endQuestPositionX;

    private bool isIluminated;
    private PlayerController playerController;

    // Start is called before the first frame update
    void Start()
    {
        playerController = FindFirstObjectByType<PlayerController>();
    }

    // Update is called once per frame
    void Update(){

       
        questAlert.SetActive(isIluminated = IsIluminated());

        if (started)
            if (playerController.transform.position.x > this.transform.position.x)
                this.transform.localScale = new Vector3(1, 1, 1);
            else
                this.transform.localScale = new Vector3(-1, 1, 1);


    }

    public void SetDialogue() {


        
    }


    public void SetNPCposition(Vector3 position) { 

    }


    public void EndQuest() {

        concluded = true;
        SetNPCposition(new Vector3(-288.2f, -0.76f, 0));


    }


    private void OnMouseDown() {
      if (isIluminated) {


            print($"Started: {started}\nitemCaught: {itemCaught}\nConcluded: {concluded}");
            if (playerController.transform.position.x > this.transform.position.x)
                this.transform.localScale = new Vector3(1, 1, 1);
            else
                this.transform.localScale = new Vector3(-1, 1, 1);

            if (this.gameObject.name.Equals("Irmaos")) {
                dialog.StartSpeech();
                return;
            }

            if (!started && !itemCaught && !concluded) {//Quest não iniciada
                
                print("Quest não iniciada");
                
                dialog.StartSpeech(dialog.profile.ToList<Sprite>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
                dialog.speechTxt.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
                dialog.actorName.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray());

                started = true;

            } else if (started && !itemCaught && !concluded) { //Quest iniciada, item NÃO pego

                print("Quest iniciada, item NÃO pego");

                dialog.StartSpeech(dialog.profile.ToList<Sprite>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray(),
                dialog.speechTxt.ToList<string>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray(),
                dialog.actorName.ToList<string>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray());


            } else if (started && itemCaught && !concluded) { //Quest iniciada, item pego, NÃO concluída

                print("Quest iniciada, item pego, NÃO concluída");

                dialog.StartSpeech(dialog.profile.ToList<Sprite>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
                dialog.speechTxt.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
                dialog.actorName.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray());

                concluded = true;

            } else if (started && itemCaught && concluded) { //Quest concluída

                print("Quest concluída");

                dialog.StartSpeech(dialog.profile.ToList<Sprite>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
                dialog.speechTxt.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
                dialog.actorName.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray());
            }
        }     

    }

    

    public bool IsIluminated() {

        List<Collider2D> col = new();
        Physics2D.OverlapCollider(this.GetComponent<Collider2D>(), new ContactFilter2D(), col);

        return col.Any<Collider2D>(itm => itm.gameObject.name == "Lantern");


    }


}
