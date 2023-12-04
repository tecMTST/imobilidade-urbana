using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.SceneManagement;

public class FOverBothObjectsCheck : MonoBehaviour
{
    public string trainScene = "TrainScene"; 
    private GameObject timerController; 
 
    private Collider2D thisCollider;


    private void Start() {
        timerController = GameObject.Find("TimerController");
        thisCollider = this.GetComponent<Collider2D>();
    }

    private void Update(){
                
        
        List<Collider2D> colliders = new ();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();
        
        thisCollider.OverlapCollider(contactFilter, colliders);

        if (colliders.Exists(item => item.CompareTag("Player"))    &&    colliders.Exists(item => item.CompareTag("Enemy")))
        {
            timerController.GetComponent<TimerController>().Captured();
            

            GameManagement.Instance.SetPlayerPosition();
        }
    }
}