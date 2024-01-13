using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class QuestItem : MonoBehaviour
{
    public PlayerController player;
    public bool caught;
    public Quest quest;

    public GameObject questAlert;

    private bool isIluminated;

    public LayerMask thisLayer;


    // Start is called before the first frame update
    void Start()
    {
        
    }

   

    // Update is called once per frame
    void Update() {

        questAlert.SetActive(isIluminated = IsIluminated());

        if (isIluminated) {

            GameManagement.Instance.AddInteract(this);


            print($"Is item iluminated {isIluminated}");


            if ((Input.GetMouseButtonDown(0) || Input.touchCount > 0)) {
                Vector3 clickPosition;


                if (Input.touchCount > 0) {
                    Touch touch = Input.GetTouch(Input.touchCount - 1);
                    clickPosition = Camera.main.ScreenToWorldPoint(touch.position);
                } else {
                    clickPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                }

                clickPosition.z = 0;

                Vector2 clickPosition2D = new Vector2(clickPosition.x, clickPosition.y);

                Collider2D hitCollider = Physics2D.OverlapPoint(clickPosition2D, thisLayer);

                //print($"HitCollider: {hitCollider.gameObject.name}");

                if (hitCollider != null && hitCollider.gameObject == gameObject) {
                    //print("CLicked");

                    Caught();

                }
            }

        } else
            GameManagement.Instance.RemoveInteract(this);



    }

    private void OnMouseDown() {

      

    }

    public void Caught() {
        quest.itemCaught = true;
        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroCatch);
        this.gameObject.SetActive(false);
    }
   

    public bool IsIluminated() {

        List<Collider2D> col = new();
        Physics2D.OverlapCollider(this.GetComponent<Collider2D>(), new ContactFilter2D(), col);

        return col.Any<Collider2D>(item => item.gameObject.name == "Lantern");

        
    }
}
