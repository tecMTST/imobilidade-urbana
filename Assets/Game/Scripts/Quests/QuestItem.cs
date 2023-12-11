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


    // Start is called before the first frame update
    void Start()
    {
        
    }

   

    // Update is called once per frame
    void Update() {

        questAlert.SetActive(isIluminated = IsIluminated());


    }

    private void OnMouseDown() {

        print("CLicked");

        if (isIluminated) {
            print("Iluminated cicked");

            quest.itemCaught = true;
            this.gameObject.SetActive(false);
        }

    }

   

    public bool IsIluminated() {

        List<Collider2D> col = new();
        Physics2D.OverlapCollider(this.GetComponent<Collider2D>(), new ContactFilter2D(), col);

        return col.Any<Collider2D>(item => item.gameObject.name == "Lantern");

        
    }
}
